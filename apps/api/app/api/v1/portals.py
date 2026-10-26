"""Business-owner and super-admin portal APIs.

All queries use the service-role client, so every route applies an explicit
role and ownership predicate before returning data.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal
from uuid import UUID

from fastapi import APIRouter
from pydantic import BaseModel, ConfigDict, Field

from app.api.deps import AdminDep, BusinessDep
from app.core.errors import ApiError, NotFoundError
from app.db.supabase import get_supabase

router = APIRouter(tags=["portals"])


def _business_for_owner(user_id: str) -> dict[str, Any]:
    result = get_supabase().table("businesses").select("*").eq("owner_id", user_id).maybe_single().execute()
    if not result or not result.data:
        raise NotFoundError("No business is linked to this account.")
    return result.data


def _paid_access(business_id: str) -> bool:
    result = get_supabase().rpc("business_has_paid_access", {"b_id": business_id}).execute()
    return result.data is True


def _mask(value: str | None, kind: str) -> str:
    if not value:
        return ""
    if kind == "email" and "@" in value:
        local, domain = value.split("@", 1)
        return f"{local[:1]}••••@{domain}"
    if kind == "phone":
        digits = "".join(c for c in value if c.isdigit())
        return f"••••••{digits[-3:]}" if digits else "••••••"
    parts = [p.strip() for p in value.split(",") if p.strip()]
    return f"••••••, {', '.join(parts[-2:])}" if parts else "••••••"


def _vendor_lead(row: dict[str, Any], unlocked: bool) -> dict[str, Any]:
    phone, email, address = row.get("phone"), row.get("email"), row.get("full_address")
    return {
        "id": row["id"], "customerName": row["customer_name"],
        "city": row.get("city") or "", "roomType": row.get("room_type") or "",
        "styleSlug": row.get("style_slug") or "", "status": row["status"],
        "createdAt": row["created_at"], "captureStatus": "4/4 Photos",
        "isUnlocked": unlocked, "phone": phone if unlocked else None,
        "email": email if unlocked else None, "fullAddress": address if unlocked else None,
        "message": row.get("notes") if unlocked else None,
        "phonePreview": _mask(phone, "phone"), "emailPreview": _mask(email, "email"),
        "addressPreview": _mask(address, "address"),
    }


@router.get("/business/leads")
async def business_leads(user: BusinessDep) -> dict[str, Any]:
    business = _business_for_owner(user.id)
    rows = get_supabase().table("consultation_leads").select("*").eq("business_id", business["id"]).order("created_at", desc=True).execute().data or []
    unlocked = _paid_access(str(business["id"]))
    return {"leads": [_vendor_lead(row, unlocked) for row in rows]}


@router.get("/business/leads/{lead_id}")
async def business_lead(lead_id: UUID, user: BusinessDep) -> dict[str, Any]:
    business = _business_for_owner(user.id)
    result = get_supabase().table("consultation_leads").select("*").eq("id", str(lead_id)).eq("business_id", business["id"]).maybe_single().execute()
    if not result or not result.data:
        raise NotFoundError(f"Lead {lead_id} does not exist.")
    return {"lead": _vendor_lead(result.data, _paid_access(str(business["id"])))}


class LeadStatusPatch(BaseModel):
    status: Literal["new", "contacted", "completed"]


@router.patch("/business/leads/{lead_id}")
async def update_business_lead(lead_id: UUID, payload: LeadStatusPatch, user: BusinessDep) -> dict[str, bool]:
    business = _business_for_owner(user.id)
    result = get_supabase().table("consultation_leads").update({"status": payload.status}).eq("id", str(lead_id)).eq("business_id", business["id"]).execute()
    if not result.data:
        raise NotFoundError(f"Lead {lead_id} does not exist.")
    return {"ok": True}


def _admin_business(row: dict[str, Any]) -> dict[str, Any]:
    owner = row.get("profiles") or {}
    subscription = row.get("business_subscriptions") or []
    sub = subscription[0] if isinstance(subscription, list) and subscription else {}
    status = "banned" if row.get("is_banned") else ("active" if row.get("is_active") else "disabled")
    return {"id": row["id"], "name": row["name"], "contactName": owner.get("full_name") or row["name"],
            "email": owner.get("email") or "", "phone": row.get("phone") or "", "location": row.get("city") or "",
            "kind": row.get("kind") or "solo_tradesman", "trade": row.get("trade") or "other",
            "tier": sub.get("tier", "free_trial").replace("free_trial", "free"), "status": status,
            "verifiedAt": row.get("verified_at"), "createdAt": row["created_at"]}


@router.get("/admin/users")
async def admin_users(_: AdminDep) -> dict[str, Any]:
    rows = get_supabase().table("profiles").select("*").order("created_at", desc=True).execute().data or []
    return {"users": [{"id": r["id"], "name": r.get("full_name") or "", "email": r["email"], "role": r["role"], "status": "active", "createdAt": r["created_at"]} for r in rows]}


@router.get("/admin/businesses")
async def admin_businesses(_: AdminDep) -> dict[str, Any]:
    rows = get_supabase().table("businesses").select("*,profiles:owner_id(full_name,email),business_subscriptions(tier,status)").order("name").execute().data or []
    return {"businesses": [_admin_business(r) for r in rows]}


@router.get("/admin/leads")
async def admin_leads(_: AdminDep) -> dict[str, Any]:
    rows = get_supabase().table("consultation_leads").select("*").order("created_at", desc=True).execute().data or []
    return {"leads": [{"id": r["id"], "customerName": r["customer_name"], "customerPhone": r["phone"], "customerEmail": r.get("email") or "", "city": r.get("city") or "", "roomType": r.get("room_type") or "", "styleSlug": r.get("style_slug") or "", "status": r["status"], "businessId": r.get("business_id"), "createdAt": r["created_at"]} for r in rows]}


@router.get("/admin/leads/{lead_id}")
async def admin_lead(lead_id: UUID, _: AdminDep) -> dict[str, Any]:
    result = get_supabase().table("consultation_leads").select("*").eq("id", str(lead_id)).maybe_single().execute()
    if not result or not result.data: raise NotFoundError(f"Lead {lead_id} does not exist.")
    r = result.data
    return {"lead": {"id": r["id"], "customerName": r["customer_name"], "customerPhone": r["phone"], "customerEmail": r.get("email") or "", "city": r.get("city") or "", "roomType": r.get("room_type") or "", "styleSlug": r.get("style_slug") or "", "status": r["status"], "businessId": r.get("business_id"), "createdAt": r["created_at"]}}


class AdminLeadPatch(BaseModel):
    status: Literal["new", "contacted", "completed"] | None = None
    business_id: UUID | None = None
    clear_business: bool = False


@router.patch("/admin/leads/{lead_id}")
async def patch_admin_lead(lead_id: UUID, payload: AdminLeadPatch, _: AdminDep) -> dict[str, bool]:
    values: dict[str, Any] = {}
    if payload.status: values["status"] = payload.status
    if payload.business_id: values["business_id"] = str(payload.business_id)
    elif payload.clear_business: values["business_id"] = None
    if not values: raise ApiError("No lead changes supplied.")
    result = get_supabase().table("consultation_leads").update(values).eq("id", str(lead_id)).execute()
    if not result.data: raise NotFoundError(f"Lead {lead_id} does not exist.")
    return {"ok": True}


@router.get("/admin/disputes")
async def admin_disputes(_: AdminDep) -> dict[str, Any]:
    rows = get_supabase().table("customer_disputes").select("*,businesses(name)").order("created_at", desc=True).execute().data or []
    return {"complaints": [{"id": r["id"], "businessId": r.get("business_id"), "businessName": (r.get("businesses") or {}).get("name", "Unassigned"), "customerName": r["customer_name"], "leadId": None, "reason": r["reason"] if r["reason"] in {"poor_service","no_show","unprofessional","overcharged","other"} else "other", "notes": r["reason"], "status": "open" if r["status"] == "pending" else r["status"], "createdAt": r["created_at"]} for r in rows]}


class DisputePatch(BaseModel):
    status: Literal["reviewing", "resolved", "dismissed"]


@router.patch("/admin/disputes/{dispute_id}")
async def patch_dispute(dispute_id: UUID, payload: DisputePatch, _: AdminDep) -> dict[str, bool]:
    result = get_supabase().table("customer_disputes").update({"status": payload.status}).eq("id", str(dispute_id)).execute()
    if not result.data: raise NotFoundError(f"Dispute {dispute_id} does not exist.")
    return {"ok": True}


class BusinessPatch(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str | None = None; phone: str | None = None; city: str | None = None
    kind: str | None = None; trade: str | None = None
    is_active: bool | None = None; is_banned: bool | None = None; verified: bool | None = None


class BusinessCreatePayload(BaseModel):
    name: str = Field(min_length=1); contact_name: str = ""; email: str
    phone: str = ""; city: str = ""; kind: str = "solo_tradesman"; trade: str = "other"


@router.post("/admin/businesses")
async def create_admin_business(payload: BusinessCreatePayload, _: AdminDep) -> dict[str, bool]:
    auth = get_supabase().auth.admin.create_user({
        "email": payload.email, "email_confirm": True,
        "user_metadata": {"full_name": payload.contact_name or payload.name},
    })
    if not auth.user:
        raise ApiError("Could not create the business login.")
    get_supabase().table("profiles").upsert({"id": str(auth.user.id), "email": payload.email, "full_name": payload.contact_name or payload.name, "role": "business"}, on_conflict="id").execute()
    get_supabase().table("businesses").insert({"owner_id": str(auth.user.id), "name": payload.name, "phone": payload.phone, "city": payload.city, "kind": payload.kind, "trade": payload.trade}).execute()
    return {"ok": True}


@router.patch("/admin/businesses/{business_id}")
async def patch_business(business_id: UUID, payload: BusinessPatch, _: AdminDep) -> dict[str, bool]:
    values = payload.model_dump(exclude_none=True)
    verified = values.pop("verified", None)
    if verified is not None: values["verified_at"] = datetime.now(timezone.utc).isoformat() if verified else None
    result = get_supabase().table("businesses").update(values).eq("id", str(business_id)).execute()
    if not result.data: raise NotFoundError(f"Business {business_id} does not exist.")
    return {"ok": True}


class ModerateBusinessPayload(BaseModel):
    action: Literal["ban", "unban"]
    reason: str = Field(min_length=1)
    complaint_id: UUID | None = None


@router.post("/admin/businesses/{business_id}/moderate")
async def moderate_business(business_id: UUID, payload: ModerateBusinessPayload, user: AdminDep) -> dict[str, bool]:
    banned = payload.action == "ban"
    values = {"is_banned": banned, "is_active": False if banned else False}
    result = get_supabase().table("businesses").update(values).eq("id", str(business_id)).execute()
    if not result.data: raise NotFoundError(f"Business {business_id} does not exist.")
    if banned:
        get_supabase().table("business_subscriptions").update({"tier": "free_trial", "status": "canceled", "current_period_end": None}).eq("business_id", str(business_id)).execute()
        get_supabase().table("business_products").update({"is_active": False}).eq("business_id", str(business_id)).execute()
    get_supabase().table("vendor_moderation_logs").insert({"business_id": str(business_id), "action": payload.action, "reason": payload.reason, "complaint_id": str(payload.complaint_id) if payload.complaint_id else None, "acted_by": user.id}).execute()
    return {"ok": True}


@router.get("/admin/moderation-log")
async def moderation_log(_: AdminDep, business_id: UUID | None = None) -> dict[str, Any]:
    query = get_supabase().table("vendor_moderation_logs").select("*").order("created_at", desc=True)
    if business_id: query = query.eq("business_id", str(business_id))
    rows = query.execute().data or []
    return {"entries": [{"id": r["id"], "businessId": r["business_id"], "action": r["action"], "reason": r["reason"], "complaintId": r.get("complaint_id"), "actedBy": r.get("acted_by") or "system", "createdAt": r["created_at"]} for r in rows]}
