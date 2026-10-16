# Pre-deployment test report

Tested in the assistant's isolated execution environment on 2026-10-16. This is not a live production deployment.

## Passed
- `node --check server.mjs`
- `node --check read-learn.js`
- `node --check report-sources.js`
- `GET /` returns HTTP 200 and HTML content.
- `GET /api/health` returns HTTP 200 and valid JSON.
- `POST /api/kundli` without provider credentials returns HTTP 503 with a clear explanation instead of fabricating a chart.
- ZIP archive integrity check passes.

## Not verified / blocked in this environment
- External place/time-zone API lookup: the outbound service request was unreachable during testing.
- Google Cloud Translation: requires a real API key, enabled API, and appropriate billing/quota.
- Prokerala Kundli: requires real client credentials and a successful provider response.
- Public hosting: not deployed because no GitHub/Render account access or credentials were provided.

## Before opening the site to the public
1. Set provider credentials as hosting environment secrets (never commit them).
2. Test the live providers with your own authorized accounts and check usage/billing limits.
3. Add a clear privacy notice for sending birth details to Prokerala and text to Google Translation.
4. Consider rate limiting and abuse protection before public traffic. Browser-local saved data does not sync between devices.
5. Note that the North Indian SVG chart remains illustrative; the provider's calculated placements are not yet fully mapped into that graphic.
