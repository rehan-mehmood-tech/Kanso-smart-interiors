/**
 * The wizard's option catalogue, in one place.
 *
 * Room types, styles and budget tiers were previously declared inline in the
 * step that rendered them, so no later step could turn `bedroom` back into
 * "Bedroom" -- which is why the review and results pages fell back to the
 * hardcoded string "Living Room". Every step now resolves labels from here.
 *
 * The ids are what travel to the backend as `room_type` and `style_slug`, so
 * they must stay in sync with the seeded `business_products.style_tags`.
 */

export interface RoomOption {
  id: string;
  title: string;
  image?: string;
  isCustom?: boolean;
}

export interface StyleOption {
  id: string;
  title: string;
  description: string;
  image: string;
  palettes: string[];
  materials: string[];
}

export interface BudgetTierOption {
  id: string;
  label: string;
  description: string;
  /**
   * Upper bound in whole rupees, sent as `budget_pkr`.
   *
   * The backend treats this as a ceiling on the total specified furnishing
   * value, filling by category priority, so a tier buys breadth rather than
   * one expensive piece.
   */
  ceilingPkr: number;
}

export const ROOM_OPTIONS: RoomOption[] = [
  {
    id: "living_room",
    title: "Living Room",
    // Japandi living room — warm wood coffee table, cream sofa, natural light
    image: "/assets/images/rooms/living-room.jpg",
  },
  {
    id: "bedroom",
    title: "Bedroom",
    // Minimalist bedroom — warm wood headboard, neutral linens
    image: "/assets/images/rooms/bedroom.jpg",
  },
  {
    id: "dining_room",
    title: "Dining Room",
    // Scandinavian dining set with ambient pendant lighting
    image: "/assets/images/rooms/dining-room.jpg",
  },
  {
    id: "home_office",
    title: "Home Office",
    // Clean minimalist workspace — solid desk, daylight from window
    image: "/assets/images/rooms/home-office.jpg",
  },
  {
    id: "kids_room",
    title: "Kids Room",
    // Modern kids bedroom — organised wooden furniture, soft palette
    image: "/assets/images/rooms/kids-room.jpg",
  },
  {
    id: "other",
    title: "Other",
    isCustom: true,
  },
];

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "modern",
    title: "Modern",
    description: "Clean lines, neutral palette, and functional elegance.",
    image: "/assets/images/styles/modern.jpg",
    palettes: ["#E6E2DC", "#C8C6C5", "#30312E", "#1C1B1B"],
    materials: ["Black Metal", "Concrete"],
  },
  {
    id: "minimal",
    title: "Minimal",
    description: "Intentional simplicity emphasizing space and light.",
    image: "/assets/images/styles/minimal.jpg",
    palettes: ["#FFFFFF", "#F5F3EE", "#DCDAD5", "#1B1C19"],
    materials: ["Light Oak", "Plaster"],
  },
  {
    id: "scandinavian",
    title: "Scandinavian",
    description: "Hygge comfort blended with bright, functional design.",
    image: "/assets/images/styles/scandinavian.jpg",
    palettes: ["#FBF9F4", "#EAE8E3", "#8B8376", "#4D463B"],
    materials: ["Pale Wood", "Wool"],
  },
  {
    id: "grey",
    title: "Grey",
    description: "Sophisticated monochromatic layers for a calm atmosphere.",
    image: "/assets/images/styles/grey.jpg",
    palettes: ["#E4E2DD", "#C4C7C7", "#747878", "#444748"],
    materials: ["Velvet", "Brushed Steel"],
  },
  {
    id: "warm_neutral",
    title: "Warm Neutral",
    description: "Earthy, inviting tones providing grounded tranquility.",
    image: "/assets/images/styles/warm-neutral.jpg",
    palettes: ["#ECE1D2", "#CFC5B7", "#8B8376", "#201B12"],
    materials: ["Linen", "Terracotta"],
  },
  {
    id: "industrial",
    title: "Industrial",
    description: "Raw materials, exposed elements, and urban edge.",
    image: "/assets/images/styles/industrial.jpg",
    palettes: ["#858383", "#5F5E5E", "#30312E", "#1C1C18"],
    materials: ["Exposed Brick", "Raw Timber"],
  },
  {
    id: "luxury",
    title: "Luxury",
    description: "Premium materials, bespoke finishes, and refined details.",
    image: "/assets/images/styles/luxury.jpg",
    palettes: ["#FFFFFF", "#DCDAD5", "#1B1C19", "#000000"],
    materials: ["Marble", "Brass"],
  },
  {
    id: "japandi",
    title: "Japandi",
    description: "Wabi-sabi simplicity meets Nordic warmth.",
    image: "/assets/images/styles/japandi-wabi-sabi.jpg",
    palettes: ["#F5F3EE", "#E4E2DD", "#CFC5B7", "#4D463B"],
    materials: ["Travertine", "White Oak"],
  },
];

export const BUDGET_TIERS: BudgetTierOption[] = [
  {
    id: "refresh",
    label: "Light Refresh",
    description: "Decor, styling, and minor updates.",
    ceilingPkr: 150_000,
  },
  {
    id: "full",
    label: "Full Furnishing",
    description: "Complete new furniture and layout.",
    ceilingPkr: 600_000,
  },
  {
    id: "overhaul",
    label: "Architectural Overhaul",
    description: "Renovation, flooring, and hard finishes.",
    ceilingPkr: 2_000_000,
  },
];

/**
 * Display name for a room id.
 *
 * `custom` covers the "Other" option, where the customer typed the room name
 * themselves and there is no catalogue entry to look up.
 */
export function roomLabel(roomId: string | null, custom?: string | null): string {
  if (!roomId) return "Room";
  if (roomId === "other") return custom?.trim() || "Custom Space";
  const match = ROOM_OPTIONS.find((option) => option.id === roomId);
  if (match) return match.title;
  // An unknown id is still better shown de-slugged than dropped.
  return roomId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Display name for a style id. */
export function styleLabel(styleId: string | null): string {
  if (!styleId) return "Unstyled";
  const match = STYLE_OPTIONS.find((option) => option.id === styleId);
  if (match) return match.title;
  return styleId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** The palette swatches for a style, used to show extracted materials. */
export function styleMaterials(styleId: string | null): { name: string; color: string }[] {
  const match = STYLE_OPTIONS.find((option) => option.id === styleId);
  if (!match) return [];
  // Pair each named material with a palette swatch; the palette is longer than
  // the material list, so the extras become unnamed tone chips.
  return match.palettes.map((color, index) => ({
    name: match.materials[index] ?? `Tone ${index + 1}`,
    color,
  }));
}

/** Budget tier id to the whole-rupee ceiling the backend expects. */
export function budgetToPkr(tierId: string | null): number | undefined {
  if (!tierId) return undefined;
  return BUDGET_TIERS.find((tier) => tier.id === tierId)?.ceilingPkr;
}

/** Display label for a budget tier id. */
export function budgetLabel(tierId: string | null): string | null {
  if (!tierId) return null;
  return BUDGET_TIERS.find((tier) => tier.id === tierId)?.label ?? null;
}
