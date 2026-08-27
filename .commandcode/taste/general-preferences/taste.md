# General Preferences

- Communicates in Spanish. Confidence: 0.9
- Explicitly prefers the agent to ask clarifying questions before starting any work ("Si tiene alguna duda, pregunte antes de comenzar"). Confidence: 0.9
- Works with React (JSX) projects using Tailwind CSS and pnpm. Confidence: 0.8
- Does Jamstack development (static sites + serverless functions/API routes). Confidence: 0.8
- Organizes projects in deeply nested folder structures (e.g. `projects/2026-proyectos/Desarrollo de aplicaciones web/...`). Confidence: 0.7
- Maintains a CHANGELOG.md following a versioned format (semver + date), updating it after implementing features. Confidence: 0.85
- Uses GitHub Actions with nodemailer + Gmail (EMAIL_USER/EMAIL_PASS secrets) for email notifications from workflows. Confidence: 0.85
- Prefers plain-text emails over HTML — explicitly rejected HTML tables in favor of simple plain-text formatting. Confidence: 0.9
- Prefers markdown (.md) format for structured data reports — after rejecting HTML, moved from plain text to requesting a .md file attachment for summaries. Confidence: 0.85
- Adds repository guards (`if: github.repository == '...'`) to GitHub Actions workflows to prevent runs on forks/mirrors. Confidence: 0.8
- Values consistency: when creating new workflows, follows the same patterns and conventions as existing ones in the repo. Confidence: 0.8
- Expects documentation (README, CHANGELOG, version bump) to be updated whenever a new feature or workflow is added — treats docs as part of the deliverable, not an afterthought. Confidence: 0.85
- Expects the agent to read and follow existing project guides/conventions (e.g. changelog guide) before making changes, rather than inventing its own format. Confidence: 0.85
