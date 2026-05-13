# Cancellation Mail Flow

This project now includes an admin workflow for sending the Odisha Raja Parba 2026 cancellation notice to registered users without sending emails manually one by one.

## Where To Use It

Admin page:

```text
/admin/cancellation-mails
```

Sidebar label:

```text
Cancellation Mail
```

Permission required:

```text
super_admin or manage_settings
```

## What The Flow Does

1. Admin opens **Cancellation Mail**.
2. Admin clicks **Preview Recipients**.
3. The API reads all relevant Firestore collections.
4. It removes duplicate email addresses.
5. It shows counts by source, missing emails, excluded records, and total unique recipients.
6. Admin sends a test email through the backend cancellation email API.
7. Admin clicks **Send Cancellation Mail to All**.
8. Emails are sent in batches of 20.
9. Each send run is logged in Firestore.

## Firestore Sources

The API reads these collections:

| Group | Collection |
| --- | --- |
| Entry / Free Pass | `delegateBookings` |
| Show Seats | `showBookings` |
| Stall Seats | `stallBookings` |
| Award Contestants | `award_applications` |
| Raja Kumari Contestants | `raja_kumari_applications` |
| Raja Queen Contestants | `raja_queen_applications` |
| Poda Pitha Contestants | `poda_pitha_applications` |
| Drawing Contestants | `drawing_applications` |
| Performers | `performers` |
| Sponsors | `sponsors` |

Records with these statuses are skipped:

```text
cancelled, failed, rejected, blocked
```

## Duplicate Handling

If the same email exists in multiple sources, the system sends only one email to that address.

Example:

```text
person@example.com booked an entry pass and also joined a contest
```

Result:

```text
person@example.com receives one cancellation email
```

## API Routes

Preview recipients:

```http
GET /api/admin/cancellation-mails
```

Send test or batch:

```http
POST /api/admin/cancellation-mails
```

Request body:

```json
{
  "start": 0,
  "batchSize": 20,
  "testEmail": "optional-test@example.com"
}
```

When `testEmail` is present, the API sends only one test email.

## Logs Created

Each send attempt creates records in:

```text
cancellation_mail_runs
cancellation_mail_run_logs
```

These logs store:

- admin who started the send
- batch start and size
- send results
- failed email errors
- message IDs where available

## Backend Email Endpoint

The email sender now uses the backend team's cancellation endpoint:

```text
https://svsamiti.com/rajaparba/cancel-email.php
```

The API currently receives:

```text
name
email
```

Expected response:

```json
{
  "status": true,
  "message": "Cancellation notice sent successfully."
}
```

No SMTP credentials are required in this Next.js project for the cancellation flow.

## What The Backend / Email Designer Needs To Provide

The endpoint already exists. Ask the backend/email person to confirm:

- the final email subject
- the final email HTML/design
- sender name, for example `Samudayik Vikas Samiti`
- sender email address
- hourly/daily sending limits
- whether the endpoint can safely receive batches over time
- whether SPF, DKIM, and DMARC are configured for the sender domain
- whether failed sends are logged on their server

## Email Template Notes

The current cancellation email template is controlled by the backend endpoint:

```text
https://svsamiti.com/rajaparba/cancel-email.php
```

The designer/backend team can improve:

- logo placement
- final wording
- Odia/Hindi/English language support
- refund/contact instructions
- official signature
- support phone/email

Keep the template simple and email-client friendly:

- table or inline style layout
- no external JavaScript
- no remote fonts required
- images must use absolute public URLs

## Recommended Operating Process

1. Confirm final cancellation text with the organizing committee.
2. Confirm sender domain and backend API behavior.
3. Use **Preview Recipients**.
4. Check missing email count.
5. Send a test email to yourself.
6. Check Gmail, Outlook, and mobile rendering.
7. Send to all.
8. Download/export Firestore logs if needed.
