/**
 * The style vocabulary shared by the customer wizard and vendor inventory.
 *
 * This is the join key for AI retrieval: a project carries one of these ids,
 * a product carries several, and the generation step matches them. If the two
 * sides ever spell a style differently, that style silently stops matching —
 * so both sides must import from here rather than restating the list.
 *
 * The ids below are the ones `app/project/new/style/page.tsx` already writes.
 */

export const STYLE_TAGS = [
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "scandinavian", label: "Scandinavian" },
  { id: "grey", label: "Grey" },
  { id: "warm_neutral", label: "Beige / Warm Neutral" },
  { id: "industrial", label: "Industrial" },
  { id: "luxury", label: "Luxury" },
  { id: "japandi", label: "Japandi" },
] as const;

export type StyleTag = (typeof STYLE_TAGS)[number]["id"];

export const STYLE_TAG_IDS: readonly StyleTag[] = STYLE_TAGS.map((s) => s.id);

const LABELS: Record<string, string> = Object.fromEntries(
  STYLE_TAGS.map((s) => [s.id, s.label]),
);

export function styleLabel(id: string): string {
  return LABELS[id] ?? id.replace(/_/g, " ");
}

export function isStyleTag(value: string): value is StyleTag {
  return STYLE_TAG_IDS.includes(value as StyleTag);
}
