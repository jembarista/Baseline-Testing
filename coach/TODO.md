# Classroom and certification delivery

## Implemented local prototype
- Roster for up to ten named students with unique account references.
- Independent practical assessment records, including second attempts.
- Theory progress recorded separately and labelled as manually reported.
- Coach approval after all practical challenges pass; theory does not gate this separate practical certificate.
- A4 certificate preview with print / save-as-PDF flow.
- Approval retains an assessment snapshot, coach, date and local identifier.
- Changed assessments require reapproval; previous approvals retained.
- Browser-local storage and classroom JSON backup export. No server issuance or dashboard release.

## Next: connect BH systems
- Confirm the exact Sensei exam and certificate plugins, versions, APIs and existing certificate templates.
- Decide whether to reuse the certificate plugin or build an issuing service with dashboard integration.
- Authenticate coaches; verify active BH Coach status and which certifications each may assess.
- Match roster students to verified BH education accounts; resolve duplicate/missing accounts.
- Import theory status from Sensei as read-only authoritative results. Keep practical and theory credentials distinct.
- Establish approved/versioned Barista Zero standards, recipe handling and second-attempt policy before real issuance.
- Submit practical results and coach approval to a server-side validation endpoint.
- Issue each certificate once using an idempotency key; record issued, failed, retrying, revoked and superseded states.
- Attach the issued certificate to the student's education dashboard and return its printable PDF.
- Reprint the same issued certificate; never issue another credential just because Print was clicked.
- Define certificate numbering, verification URL, signature/branding and correction/revocation workflow.
- Support intermittent classroom connectivity with clear pending-sync state and safe retry.
- Add shared server storage, backup restore/import, privacy/retention controls and an audit trail.
- Add a completed-training-day summary showing theory, practical and certificate delivery independently.
- Later: Barista One, Percolation and Immersion assessment schemas and certificate templates.

## Intended classroom workflow
1. Coach creates the training-day roster (normally 2–10 students).
2. Students sit the existing theory exam on baristahustle.com.
3. Coach selects each student, configures equipment and administers the practical.
4. Coach records scores and may offer one second attempt per challenge.
5. Coach approves a complete practical pass.
6. Connected issuing service validates and releases the practical certificate to the education dashboard.
7. Coach prints that certificate for the student if requested.

Steps 6 and authoritative theory sync are not connected in this prototype. Current printouts are explicitly marked as previews.

## Required before enabling certificates: coach login and removal
- Password-protected login; prefer existing BH account authentication once its integration is confirmed. No separate browser-stored password or role toggle.
- Server-side roles: student, pending coach, active BH-approved coach, suspended/revoked coach, BH administrator.
- Only BH administrators may approve, suspend, revoke or reinstate coaches and assign certification permissions. Self-registration never confers coach access.
- Verify active approval on every issue, retrieve-PDF and reprint request. Hiding buttons alone is not security.
- Revocation invalidates active sessions and denies subsequent requests immediately. Preserve assessment and issuance history; do not hard-delete audit records.
- Treat coach removal and certificate revocation as separate actions. Previously issued certificates remain valid unless BH explicitly revokes them.
- Password reset, secure session cookies, expiry, login rate limits, CSRF protection and administrator audit trail.
- Certificate PDFs must be delivered by an authorised endpoint, not placed in public static assets. Authorised downloaded/printed copies cannot be recalled.
- Students must never see coach issuance/printing controls. Decide separately whether students may download their own issued certificate from the existing education dashboard.
- Security tests: anonymous/student/pending/revoked users denied; cross-coach access denied; forged client roles ignored; already-open sessions blocked after revocation.

Current state: certificate creation and preview rendering are disabled, including direct UI function calls. Coach login screen describes the pending integration and does not collect passwords. This remains a public/local scoring prototype, not an authenticated production application.

- Resits: coach discretion; no reason required. Retain both attempts and the approving coach/date.

- Student details are entered by the coach on the testing pages, not during coach sign-in.

- Criteria feedback now lives beside each scoresheet criterion, enabled by a toggle. Local drafts do not change scores or standards. Require authenticated users for future submission; attach criterion/version, equipment context and BH review status. No separate Criteria Lab screen.

## Student account and certification release
- Each certification assessment now stores a separate `bhStudentId`, editable in phone and A4 scoresheets and retained in browser saves/JSON exports. Practice does not require it. A certificate-eligible result requires it.
- Integration requirement: an active, authorised BH Coach's successful completed certification attempt triggers server-side validation and release of that certification's certificate to the verified student's baristahustle.com dashboard. Do not wait for Print or require student login in this app.
- Validate the BH ID against the real account and confirm the student's name before issuing. Never trust client scores or coach roles alone. Use a unique assessment ID and idempotent release; show pending/issued/error states and safely retry. No release endpoint is connected yet.
