---
name: Tailwind v4 Color Rule
description: Never use named Tailwind colors for brand colors — always arbitrary hex values
type: feedback
originSessionId: 189febc6-226e-42e3-a98f-27079ca66e81
---
Always use arbitrary hex values (`bg-[#2BBCB0]`, `text-[#2BBCB0]`) for brand colors, never named Tailwind palette names like `bg-teal-500`.

**Why:** In Tailwind v4, adding named custom colors to `@theme inline` conflicts with Tailwind's built-in palette and produces wrong colors (blue instead of teal). Arbitrary hex values bypass this conflict entirely.

**How to apply:** For every brand color instance — buttons, links, borders, icons — use the full hex in bracket notation. Use inline `style={{}}` only for static colors that never need hover state.
