---
name: feedback-deploy-verification
description: "Before concluding a fix 'didn't work' in production, verify git status/log and the actual deployed commit — don't assume a code bug"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 6d7a1ecb-f10c-42b0-9aad-0eb35639be0a
  modified: 2026-08-02T00:49:37.875Z
---

When the user reports that a fix "doesn't seem to have applied" or production still shows old behavior, the first check is always: is the fix actually committed, pushed, and deployed? Run `git status`, `git log --oneline`, compare `origin/main`, and (on Vercel) `vercel inspect <url> --logs | grep -i commit` to confirm which commit is actually live — before assuming there's a residual bug in the code.

**Why:** In the Artentino project this happened more than once. A guest-checkout fix was fully correct in the working tree but never committed/pushed in a prior turn, so the user kept seeing the old `/login` redirect in production and reasonably assumed the fix was broken — it was simply never deployed. Separately, a Zipnova error log the user pointed to as "current" turned out to be from several deployments earlier (before three subsequent fixes), which would have led to a wrong diagnosis if taken at face value without checking deployment timestamps against commit history.

**How to apply:** Treat "it's not working in prod" reports as requiring a deployment-state check before a code-level investigation. Specifically: (1) confirm the working tree has no uncommitted relevant changes, (2) confirm local HEAD matches `origin/main`, (3) confirm the live Vercel deployment's build log shows that same commit hash — only then treat the report as evidence of a real, still-unfixed bug. This project uses `vercel --prod --force` for manual redeploys when a GitHub-triggered auto-deploy isn't confirmed or cache needs busting.
