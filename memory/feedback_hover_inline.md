---
name: Hover vs Inline Style Rule
description: Elements needing hover color change must use only className for base color, never inline style
type: feedback
originSessionId: 189febc6-226e-42e3-a98f-27079ca66e81
---
Never combine `style={{ backgroundColor: '#hex' }}` on the same element as `hover:bg-[#hex]` class — the hover class won't work.

**Why:** Inline `style={}` has higher CSS specificity than utility classes, so `hover:bg-[#2BBCB0]` cannot override `style={{ backgroundColor: '#1E1E1E' }}`. The hover effect is silently ignored.

**How to apply:**
- Elements with hover color change → use ONLY className: `bg-[#1E1E1E] hover:bg-[#2BBCB0]`
- Elements with static color only → inline style is fine: `style={{ backgroundColor: '#2BBCB0' }}`
- Applies to text, border, background colors equally
