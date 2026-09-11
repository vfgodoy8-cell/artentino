---
name: feedback-diagnose-before-fix
description: "User strongly prefers a confirmed diagnosis (real logs/data) before any fix, even when a fix seems obvious"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 6d7a1ecb-f10c-42b0-9aad-0eb35639be0a
  modified: 2026-08-02T00:49:27.406Z
---

Never patch a bug from a plausible guess — confirm root cause against real evidence (Vercel runtime logs, direct DB queries, the actual API response shape) first, and report that diagnosis before touching code, even when explicitly asked to fix something.

**Why:** In the Artentino project (checkout/shipping work), this was validated repeatedly and explicitly: the user's prompts consistently said things like "no apliques ningún fix todavía, quiero ver el diagnóstico completo primero, porque ya nos pasó una vez que un 'arreglo' solo corrigió una parte del problema." Two concrete cases where jumping to a plausible fix would have been wrong or incomplete:
1. A Zipnova shipping-cost bug looked at first like "convert kg to grams" — but the real fix (confirmed only by reading actual Vercel logs of the request/response) was the opposite: the catalog was already in grams, and the code had a spurious `*1000` conversion. Auditing all 155 products' weights (read-only, sorted, flagged) before touching anything is what surfaced this.
2. A Zipnova response-parsing crash looked like a network/config issue, but real logs showed `results` is an object indexed by service_type.code, not an array as the code (and the vendor's docs) assumed.

**How to apply:** When debugging a production issue in this project (or similarly complex integrations elsewhere), always: (1) pull the real log/response data first — don't reason from documentation or assumption alone, (2) present the confirmed diagnosis with exact values/line numbers, (3) wait for explicit go-ahead before implementing the fix, even if the user's message also describes what they think the fix should be. When they say "mostrame el diagnóstico antes de tocar código," treat that as a hard gate, not a formality.
