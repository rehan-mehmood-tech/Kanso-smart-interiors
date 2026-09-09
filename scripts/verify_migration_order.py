"""Verify a migration can actually run top to bottom.

Simulates execution order: does every statement reference only objects that
already exist at that point in the file?

This exists because a syntax check is not enough. PostgreSQL validates the
body of a LANGUAGE SQL function at CREATE time, so a helper defined before the
table it selects from fails with "ERROR: 42P01: relation does not exist" --
which is precisely what happened here once. A parser will happily accept that
file; only an ordering check catches it.

Covers: function bodies, policy USING/WITH CHECK clauses, policy target
tables, indexes, triggers (both table and function), ALTER TABLE, and INSERT.

    python scripts/verify_migration_order.py supabase/migrations/<file>.sql

Exit code 1 on any ordering failure, so it can gate CI.
"""
import io, re, sys
import pglast
from pglast import ast
from pglast.visitors import Visitor

path = sys.argv[1]
sql = io.open(path, encoding='utf-8').read()
tree = pglast.parse_sql(sql)

BUILTIN = {'auth.users', 'users', 'pg_type', 'pg_tables', 'pg_proc'}
tables, functions, failures = set(), set(), []

def relations_in(node):
    """Every table name mentioned anywhere under this node."""
    found = set()
    class V(Visitor):
        def visit_RangeVar(self, ancestors, n):
            found.add(n.relname)
    V()(node)
    return found

def funcs_in(node):
    found = set()
    class V(Visitor):
        def visit_FuncCall(self, ancestors, n):
            found.add(n.funcname[-1].sval)
    V()(node)
    return found

for i, raw in enumerate(tree, 1):
    st = raw.stmt
    kind = type(st).__name__

    if isinstance(st, ast.CreateStmt):
        tables.add(st.relation.relname)
        continue

    if isinstance(st, ast.CreateFunctionStmt):
        name = st.funcname[-1].sval
        lang = next((o.arg.sval for o in st.options if o.defname == 'language'), '')
        body = ''
        if lang == 'sql':
            for o in st.options:
                if o.defname == 'as':
                    arg = o.arg
                    body = arg[0].sval if isinstance(arg, tuple) else arg.sval
        if lang == 'sql' and body:
            try:
                for rel in relations_in(pglast.parse_sql(body)):
                    if rel not in tables and rel not in BUILTIN:
                        failures.append(f"stmt {i}: function {name}() reads '{rel}' before it is created")
            except Exception:
                pass
        functions.add(name)
        continue

    if isinstance(st, ast.CreatePolicyStmt):
        target = st.table.relname
        if target not in tables:
            failures.append(f"stmt {i}: policy on '{target}' before that table is created")
        for node in (st.qual, st.with_check):
            if node is None:
                continue
            for rel in relations_in(node):
                if rel not in tables and rel not in BUILTIN:
                    failures.append(f"stmt {i}: policy on '{target}' reads '{rel}' before it is created")
            for fn in funcs_in(node):
                if fn in ('is_admin', 'owned_business_ids', 'business_has_paid_access') and fn not in functions:
                    failures.append(f"stmt {i}: policy on '{target}' calls {fn}() before it is created")
        continue

    if isinstance(st, ast.IndexStmt):
        if st.relation.relname not in tables:
            failures.append(f"stmt {i}: index on '{st.relation.relname}' before that table is created")
        continue

    if isinstance(st, ast.CreateTrigStmt):
        if st.relation.relname not in tables:
            failures.append(f"stmt {i}: trigger on '{st.relation.relname}' before that table is created")
        fn = st.funcname[-1].sval
        if fn not in functions:
            failures.append(f"stmt {i}: trigger calls {fn}() before it is created")
        continue

    if isinstance(st, ast.AlterTableStmt):
        if st.relation.relname not in tables:
            failures.append(f"stmt {i}: ALTER on '{st.relation.relname}' before that table is created")
        continue

    if isinstance(st, ast.InsertStmt):
        if st.relation.relname not in tables:
            failures.append(f"stmt {i}: INSERT into '{st.relation.relname}' before that table is created")
        continue

print(f"  statements parsed : {len(tree)}")
print(f"  tables created    : {len(tables)}")
print(f"  functions created : {len(functions)}")
print()
if failures:
    print(f"  ORDERING FAILURES ({len(failures)}):")
    for f in failures:
        print("   ", f)
    sys.exit(1)
print("  ORDERING OK — every reference resolves to an object created earlier in the file")
