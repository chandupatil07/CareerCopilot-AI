# File Explanation: branding_guide.md

## 1. What is it?
`branding_guide.md` is a design specification document that details the corporate visual identity of CareerCopilot AI.

## 2. Why is it needed?
A professional SaaS platform needs consistent branding. This guide ensures that developers, designers, and marketers use the correct hex codes, font scales, and logo guidelines to build a unified interface.

## 3. How does it work?
It lists style definitions (CSS variables, font family declarations, graphic elements) and how to apply them.

## 4. Real-world example
Tech giants like Google, Material Design, and Stripe maintain public branding guidelines to preserve design consistency across their global suites of apps.

## 5. Advantages
- **Design Consistency:** Prevents random style variations.
- **Speeds Up UX Decisions:** Developers know exactly which color tokens and typography to apply.
- **Accompanying SVG Code:** References the SVG parameters for drawing the corporate logo component.

## 6. Limitations
- **Format:** As a markdown file, it lists design specifications but does not host design file binaries (like Figma files or PNGs directly, unless linked).

## 7. Interview questions
- *Why is a consistent typography hierarchy important in SaaS products?*
- *What role do secondary brand accent colors play in conversion-driven UI components?*

## 8. Interview answers
- *Answer:* A typography hierarchy guides the user's eye (visual hierarchy), improving content readability and lowering cognitive friction in complex data dashboards.
- *Answer:* Accent colors draw attention to high-value Call-To-Action (CTA) elements (like "Apply Now" or "Generate Resume") without cluttering the screen or overwhelming the user.

---

# Branding Guide: CareerCopilot AI

## 1. Color Palette
The brand color scheme communicates intelligence, stability, and professionalism.

- **Primary Background (Midnight Blue):** `#0A1128`
  * Represents deep technology, professionalism, and provides a comfortable dark workspace.
- **Card/Scaffolding Background (Navy Blue):** `#1C2541`
  * Used for panels, header backgrounds, and form groupings.
- **Accent Highlight (Electric Cyan):** `#00B4D8`
  * Represents the AI circuit, direction, compass path, and active hover states.
- **Text Color (Pure White):** `#FFFFFF`
  * Standard readable body text.
- **Muted Subtext (Slate Gray/Blue):** `#94A3B8`
  * Used for side labels, subheadings, and captions.

## 2. Typography
We use two Google Fonts imported via the entry HTML file:
- **Headers & Accent Text:** `Outfit` (sans-serif) - a modern, round geometric typeface.
- **Body Text:** `Inter` (sans-serif) - highly legible and optimized for screen reading.

## 3. Logo Concept
The Logo component draws a combination of:
- **Compass Circle:** Indicating direction and AI career guidance.
- **Career Path:** A rising diagonal line crossing the compass.
- **AI Circuit:** Circuit dots connecting the paths to represent smart, automated decisions.
- **Logo Code:** Represented as a React component using inline SVGs (`src/components/Logo.jsx`).
