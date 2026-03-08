# Assessment Feature README

## Purpose
This module adds a structured post-confirmation assessment flow for:
- Raja Queen
- Raja Kumari
- Drawing Senior
- Drawing Junior

It connects **admin enablement**, **candidate assessment execution**, and **progress tracking** in one system.

## High-Level Flow
1. Candidate submits registration form (existing flow).
2. Admin confirms candidate in CRM (existing Raja activity flow).
3. Admin opens `Admin > Assessment` and clicks `Enable Assessment For All Confirmed` for a track.
4. Candidate sees `Start Assessment` button in profile card (only when:
   - registration status is confirmed/approved
   - assessment session is enabled by admin)
5. Candidate opens assessment page and completes steps sequentially.
6. Each step writes progress to Firestore so state is resumable.
7. Quiz has strict lock logic:
   - if quiz starts and user re-enters later while quiz is in progress, system marks attempt as abandoned and locks assessment.

## Data Model (Firestore)
- `assessment_sessions` (one document per candidate per track)
  - document id: `<assessmentType>_<applicationId>`
  - fields:
    - `assessmentType`
    - `applicationId`
    - `collectionName`
    - `candidateName`, `candidateEmail`, `userId`
    - `enabled`, `enabledAt`, `enabledBy`, `enabledByName`
    - `assessmentStatus`: `not_enabled | enabled | in_progress | completed | locked`
    - `currentStepId`
    - `stepStates` map (status + submission data per step)
    - `quiz` object (status, startedAt, duration, shuffled questions, answers, score, lockedReason)
    - timestamps

## Assessment Types and Steps
Defined in:
- `src/lib/assessment/templates.js`

Types:
- `rajaQueen`
- `rajaKumari`
- `drawingSenior`
- `drawingJunior`

Step templates:
- video upload
- quiz (15 questions, 5 minutes)
- image upload
- self-introduction
- zoom slot

## Key Service Layer
Implemented in:
- `src/services/assessmentService.js`

Core functions:
- `getAssessmentSessionId`
- `getCandidateApplicationDoc`
- `getOrCreateAssessmentSession`
- `getAssessmentSession`
- `enableAssessmentsForConfirmedCandidates`
- `getTrackCandidatesWithSessions`
- `uploadAssessmentFile`
- `saveAssessmentStep`
- `startQuizAttempt`
- `submitQuizAttempt`
- `markQuizAbandoned`
- `completeAssessmentSession`
- `canStartAssessment`

## Candidate UI
Route:
- `src/app/(auth)/assessment/[assessmentType]/[applicationId]/page.jsx`

Main client component:
- `src/components/assessment/AssessmentPageClient.jsx`

Sub-components:
- `src/components/assessment/AssessmentShell.jsx`
- `src/components/assessment/AssessmentStepNav.jsx`
- `src/components/assessment/steps/VideoUploadStep.jsx`
- `src/components/assessment/steps/ImageUploadStep.jsx`
- `src/components/assessment/steps/SelfIntroductionStep.jsx`
- `src/components/assessment/steps/ZoomMeetingStep.jsx`
- `src/components/assessment/steps/QuizStep.jsx`

## Profile Integration
Profile cards now conditionally show `Start Assessment` button for:
- Raja Kumari
- Raja Queen
- Drawing (Senior/Junior inferred from category)

Files:
- `src/app/(auth)/profile/page.jsx`
- `src/components/profile/ContestApplicationCard.jsx`

## Admin UI
Admin page:
- `src/app/(admin)/admin/assessment/page.jsx`

Components:
- `src/components/admin/assessment/AssessmentManagement.jsx`
- `src/components/admin/assessment/AssessmentTrackPanel.jsx`
- `src/components/admin/assessment/AssessmentCandidateTable.jsx`

Sidebar entry:
- `src/components/admin/layout/AdminSidebar.jsx`

### Quiz Settings Admin Page
Track-wise quiz question bank management is available at:
- `src/app/(admin)/admin/assessment-quiz/page.jsx`
- `src/components/admin/assessment-quiz/AssessmentQuizSettings.jsx`
- `src/components/admin/assessment-quiz/QuizQuestionEditorCard.jsx`

Storage:
- Firestore collection: `assessment_quiz_banks`
- Doc id: `rajaQueen`, `rajaKumari`, `drawingSenior`, `drawingJunior`

Candidate quiz start reads track-wise bank from Firestore and falls back to defaults in:
- `src/lib/assessment/templates.js`

## Notes for Future Developers
1. Keep assessment logic centralized in `assessmentService.js`.
2. Add new tracks by:
   - extending `templates.js`
   - ensuring collection mapping and candidate filter logic
3. Quiz behavior is intentionally strict; update only with product approval.
4. If server-side anti-cheat is needed, add API routes for signed session heartbeat and integrity events.
5. For production scale, move large table fetches to paginated server endpoints.

## Known Next Improvements
1. Add admin candidate-level enable/disable toggle (currently bulk by track).
2. Add richer admin evaluation UI per step with reviewer scoring.
3. Add dedicated Zoom scheduling workflow.
4. Add role-based permission `view_assessment` for stricter access control.
