---
name: Quiet Luxury Minimalist
colors:
  surface: '#fbf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#444748'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#605e5a'
  on-secondary: '#ffffff'
  secondary-container: '#e6e2dc'
  on-secondary-container: '#666460'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#201b12'
  on-tertiary-container: '#8b8376'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e6e2dc'
  secondary-fixed-dim: '#cac6c1'
  on-secondary-fixed: '#1c1c18'
  on-secondary-fixed-variant: '#484743'
  tertiary-fixed: '#ece1d2'
  tertiary-fixed-dim: '#cfc5b7'
  on-tertiary-fixed: '#201b12'
  on-tertiary-fixed-variant: '#4d463b'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-xl:
    fontFamily: notoSerif
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 84px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: plusJakartaSans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: plusJakartaSans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: plusJakartaSans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: plusJakartaSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: plusJakartaSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: plusJakartaSans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 96px
  container-max-marketing: 1440px
  container-max-app: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style
The design system is rooted in "Warm Minimalism" and "Architectural Editorial" aesthetics. It targets a premium audience seeking sophistication, clarity, and intentionality in interior design. The UI must evoke a sense of calm, high-end craftsmanship, and spatial intelligence.

The style leverages **Minimalism** with a **Tactile** edge. It prioritizes generous whitespace to allow high-fidelity furniture photography to breathe. The interface should feel like a physical gallery: structured, understated, and timeless. Motion should be restrained, using slow eases and subtle fades to mimic the quiet movement of light in a well-designed room.

## Colors
The palette is a sophisticated range of earth-toned neutrals. The primary "Bone White" background creates a warm, parchment-like canvas that is softer and more premium than pure white. 

- **Primary & Secondary:** Used for high-contrast text and structural elements to ensure readability and authority.
- **Accent (Taupe):** Reserved for subtle highlights, interactive states, or decorative architectural lines.
- **Success & Error:** Rendered in muted, organic tones (Olive and Terracotta) to maintain the "Quiet Luxury" aesthetic without introducing jarring neon safety colors.

## Typography
This design system employs a dual-font strategy to balance editorial elegance with functional clarity.

- **Serif (Noto Serif):** Used exclusively for high-level display moments and major brand statements. It provides the "Architectural Editorial" feel.
- **Sans (Plus Jakarta Sans):** The workhorse for the UI. It features a soft, modern geometry that feels approachable yet professional.
- **Hierarchy:** Maintain tight tracking on headlines for a "locked-in" architectural look. Use generous line-heights for body copy to enhance the feeling of space and luxury.

## Layout & Spacing
The layout philosophy follows a **Fixed Grid** model within max-width containers to ensure visual balance on large displays. 

- **Desktop:** 12-column grid with 24px gutters. Use wide margins (up to 128px) for marketing sections to emphasize exclusivity.
- **Mobile:** 4-column grid with 16px margins.
- **Rhythm:** Use the 8px base unit religiously. Elements should be grouped with small gaps (8px-16px), while distinct sections should be separated by massive "breathing room" (80px-128px).

## Elevation & Depth
Depth is created through **Tonal Layering** rather than heavy shadows. 

- **Surface Levels:** The base is Bone White. Elevated cards or modals use Pure White to "pop" forward subtly.
- **Shadows:** Use a single, extremely diffused "Ambient Shadow" (4% opacity Charcoal) to suggest that objects are resting just millimeters above the surface. 
- **Outlines:** Use 1px borders in "Light Stone" for most containers. This provides structure without the visual weight of traditional shadows.

## Shapes
The shape language is "Softly Architectural." 

- **Default (8px):** Applied to buttons, input fields, and small UI components.
- **Large (16px):** Reserved for primary image containers and hero cards. This extra radius softens the high-contrast photography, making the interface feel more organic and less "technical."
- **Interactive States:** Avoid aggressive hover transformations. Prefer subtle color shifts or very slight scale increases (1.02x).

## Components
- **Buttons:** Primary buttons are Deep Charcoal with White text, featuring no border-radius beyond 8px. Secondary buttons use a Stone Grey border with no fill.
- **Inputs:** Minimalist bottom-border only or very light Stone Grey strokes. Focus states should use a subtle 1px Taupe ring.
- **Cards:** Pure White background, 16px corner radius, and the system's signature 4% ambient shadow. Padding within cards should be generous (min 32px).
- **Chips:** Used for "Material" or "Style" tags. These should have 0px or 4px radius (sharper than buttons) to feel like architectural labels.
- **Lead Gen Forms:** Break forms into multi-step sequences with high whitespace to reduce cognitive load and maintain the premium experience.