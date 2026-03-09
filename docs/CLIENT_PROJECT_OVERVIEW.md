# Raja Festival 2026 - Project Overview (Client Document)

Date: 9 March 2026
Project: Raja Festival 2026 (Web + Admin Platform)
Tech Stack: Next.js 16, React 19, Firebase (Auth, Firestore, Storage), Zustand, CCAvenue payment integration

## 1. Objective
This platform manages the full Raja Festival journey for users and organizers:
- Public festival information and cultural storytelling
- User registration/login and profile
- Bookings (Show, Stall, Donation, Free Entry Pass)
- Participation applications (Sponsor, Performer, Award, Raja Kumari, Raja Queen, Drawing)
- Assessment workflow with anti-reentry quiz controls and live camera/mic monitoring during quiz
- Admin CRM and operations dashboard for all registrations, bookings, passes, seats, pricing, settings, and logs

## 2. Solution Architecture (High-Level)
- Frontend: Next.js App Router, responsive pages for web and admin
- Authentication: Firebase auth for users; dedicated admin auth store for admin panel
- Database: Firestore collections for users, bookings, donations, participation applications, guests, gallery, settings, and logs
- Media Storage: Firebase storage for uploaded photos/documents/videos
- Payment: CCAvenue flow with request/response/status sync routes
- Authorization: Admin permission-based navigation and page access (PermissionGate)

---

## Part A - User Interface (Client-Facing)

### A1. Public Navigation & Core Pages
Main user menu and mobile menu include:
- Home (`/`)
- About Raja (`/about-raja`)
- Events (`/events`)
- Gallery (`/gallery`)
- Our Guests (`/guests`)
- Donate (`/donate`)

Additional static and information pages:
- FAQs (`/faqs`)
- Notice (`/notice`)
- Terms and Conditions (`/terms-and-conditions`)
- Privacy Policy (`/privacy-policy`)
- Refund/Cancellation Policy (`/refund-cancel-policy`)

### A2. Home Experience
Home page includes modular sections:
- Hero and cultural branding
- Event participation CTA section
- Featured cards and festival highlights
- Ticket/highlight section
- Gallery preview section
- Donation banner CTA
- Embedded video section
- Booking CTA section

### A3. Festival Participation Pages
Users can apply for multiple tracks:
- Sponsor (`/sponsor`)
  - Captures individual/organization details
  - Confirmation flow + profile tracking
- Performer (`/performer`)
  - Performance type, solo/group, group members, track details
- Award (`/award`)
  - Multilingual award details, category selection, profile details
- Raja Kumari (`/raja-kumari`)
  - Candidate profile + photo upload, age and eligibility handling
- Raja Queen (`/raja-queen`)
  - Candidate profile + photo upload, age and eligibility handling
- Drawing (`/drawing`)
  - Candidate details, DOB-based age/category logic, photo upload

### A4. Booking & Transaction Flows
- Show Booking (`/show`)
  - Step flow: date -> seat selection -> user details -> payment
  - Real-time seat handling and booking validation
- Stall Booking (`/stall`)
  - Vendor/stall booking workflow and payment integration
- Donation (`/donate`)
  - Donor flow with type handling and receipts
- Free Entry Pass (`/free-pass`)
  - Protected route (login required)
  - Personal + location + members form (up to 20 persons)
  - Aadhar, contact, address validations
  - Optional photo upload
  - One-pass-per-user guard
  - Free booking confirmation + email notification

Payment result pages:
- Success (`/payment/success`)
- Status (`/payment/status`)
- Failed (`/payment/failed`)
- Cancel (`/payment/cancel`)

### A5. User Authentication & Identity
User auth pages:
- Login (`/login`) with email/password and Google sign-in
- Register (`/register`)
- Forgot Password (`/forgot-password`)
- Reset Password (`/reset-password`)

### A6. User Profile Dashboard (`/profile`)
Single profile dashboard consolidates all user records with tabs:
- Shows
- Stalls
- Entry Pass
- Donations
- Sponsor
- Performer
- Award
- Raja Kumari
- Raja Queen
- Drawing

Profile capabilities:
- Status-aware cards (pending/confirmed/etc.)
- Pass modal access for participation cards
- Quick actions and support info
- Direct deep link tab support (`?tab=...`)

### A7. Assessment Feature (Post-Confirmation)
Assessment route:
- `/assessment/[assessmentType]/[applicationId]`

Enabled tracks:
- Raja Queen
- Raja Kumari
- Drawing Senior
- Drawing Junior

Flow highlights:
- Admin enables assessment for confirmed candidates
- Candidate can start from profile card
- Sequential step completion with persisted progress in Firestore
- Re-entry protection: if quiz is left in-progress, attempt is marked abandoned and track is locked

Assessment steps (track-config driven):
- Video upload
- Quiz
- Image upload / media bundle (track-dependent)
- Self-introduction / text step (where configured)
- Zoom meeting slot/instructions

Live camera & microphone implementation:
- Quiz explicitly requests browser permissions using `navigator.mediaDevices.getUserMedia`
- Video + audio constraints are enabled together
- Live camera preview remains on-screen during quiz
- Permission denial blocks quiz start

### A8. Entry Pass Dependency for Participation
Competition/participation flows include checks and alerts linked to entry-pass eligibility flow before proceeding in sensitive tracks.

---

## Part B - Admin Interface (Operations CRM)

### B1. Admin Authentication
- Admin login page: `/admin/login`
- Redirect to `/admin/dashboard` after successful auth
- Theme-aware login UI with secure credential flow

### B2. Admin Dashboard (`/admin/dashboard`)
Central executive summary:
- Counts: sponsors, performers, Raja Queen, Raja Kumari, awards, drawing, stall bookings, show bookings, entry passes, users
- Revenue cards: stall, show, donation, total
- Recent bookings table with latest records and status

### B3. Bookings Management
1. Stall Bookings (`/admin/bookings/stalls`)
- Search/filter + paginated table
- View booking detail modal
- Confirm/cancel and cancellation workflow
- Participation marking
- Document viewer for uploaded files

2. Show Bookings (`/admin/bookings/shows`)
- Search/status/date/participation filters
- Detail modal and cancellation modal
- Confirm/approve/reject status actions
- Participation modal and tracking

3. Entry Pass Management (`/admin/entry-pass-management`)
- Manage free pass records from delegateBookings
- Search + status + participation + date filters
- Confirm/cancel actions
- Participation marking
- Detail modal + pagination

### B4. Seat & Layout Control
1. Stall Seats (`/admin/stalls`)
- Real-time stall availability map
- Status model: available, booked, blocked
- Search and status filters
- Grid/list views
- Multi-select and bulk block/unblock operations

2. Show Seats (`/admin/show-seats`)
- Date-wise seat state management
- Grid and list view modes
- Filter by availability status
- Multi-select bulk block/unblock
- User detail popup for booked seats
- Recently released seats highlighted

### B5. Raja Activity Management (`/admin/raja-activities`)
Tabbed CRM for:
- Sponsors
- Performers
- Award nominees
- Raja Queen
- Raja Kumari
- Drawing

Common capabilities across tabs:
- View candidate/applicant details
- Confirm/reject status updates
- Event date/time assignment (where applicable)
- Admin notes
- Delete controls (role-guarded)

### B6. Assessment Admin
1. Assessment Lifecycle (`/admin/assessment`)
- Track-wise monitoring (Raja Queen, Raja Kumari, Drawing Senior, Drawing Junior)
- Enable assessment for all confirmed candidates per track
- Candidate-level session monitoring and detailed modal

2. Assessment Quiz Settings (`/admin/assessment-quiz`)
- Track-wise question bank management
- Add/edit/remove questions
- 4-option answer structure validation
- Save custom question banks to Firestore
- Reset to default template

### B7. Content Management
1. Gallery Management (`/admin/gallery`)
- Multi-image uploader
- Grid/list management views
- Mark/unmark showcase images
- Bulk select, bulk update, bulk delete
- Edit metadata modal

2. Distinguished Guests (`/admin/distinguished-guests`)
- Add/edit/delete guest records
- Category handling (special/spiritual/artist)
- Image upload and ordering
- Active/expected guest controls

### B8. Business Settings & Pricing
1. Price Settings (`/admin/price-settings`)
- Stall pricing configuration
- Show pricing configuration
- Discount components (early-bird/bulk structures in pricing module)
- Sync state and save workflow

2. System Settings (`/admin/settings`)
- Stall settings tab
- Show settings tab
- Event configuration save workflow

### B9. Governance & Security
1. User Management (`/admin/users`)
- User stats cards
- Search/filters
- User table with status/sign-in/joined details
- CSV export

2. Admin Management (`/admin/admins`)
- Add/edit/delete admins
- Role and granular permission assignment
- Permission category handling

3. Pass Scanner (`/admin/scan`)
- Camera-based QR scan + fallback parser
- Manual verification input mode
- Verifies entry pass, show, stall, performer, award, Raja Kumari, Raja Queen, drawing, sponsor
- Result modal with pass and booking details

4. Activity Logs (`/admin/logs`)
- Search + date/action/admin filters
- Pagination
- CSV export for audit trail

---

## 3. Cross-Cutting Capabilities
- Responsive UI for desktop and mobile across user/admin flows
- Email notifications for key journeys (booking/applications/pass)
- Firestore real-time updates in operational modules
- Role/permission-aware admin navigation and page rendering
- Booking/document handling for admin verification

## 4. Deliverables Covered in This Build
User side deliverables implemented:
- Home, About Raja, Gallery, Events, Guests, static policy pages
- Sponsor, Performer, Award, Raja Kumari, Raja Queen, Drawing
- Free Pass with validations + profile integration
- Profile dashboard with all booking/application tabs
- Pass modal for application cards
- Assessment feature with live camera/mic in quiz
- User login/register/forgot/reset flows

Admin side deliverables implemented:
- Admin login
- Dashboard analytics + revenue + recent bookings
- Stall/show booking management
- Stall/show seat management
- Entry pass management
- Raja activity management across all categories
- Assessment + assessment quiz controls
- Gallery and distinguished guests management
- Donation management
- User and admin management
- Price settings + system settings
- Pass scanner and activity logs

## 5. Notes for Client Communication
- This platform is not only a public website; it is a full event operations system with CRM-like admin controls.
- Assessment is integrated end-to-end from candidate status to monitored quiz execution.
- Free Pass, competition applications, and booking records are unified in user profile and admin dashboards for transparent tracking.
