# Hidden Product Spec

## 1. Overview

Hidden is a web-based anonymous question box platform. It focuses on three actors:

- Visitors submit anonymous questions.
- Registered users manage one or more personal question boxes.
- Administrators govern the whole platform.

The first version should prioritize clear role boundaries, a smooth ask-and-answer flow, and straightforward moderation controls.

## 2. Product Goals

- Let a visitor submit an anonymous question in a few steps.
- Let a user manage multiple question boxes from one account.
- Let a user review questions before deciding whether to answer and publish them.
- Let administrators monitor and moderate all platform content.
- Keep the first version simple enough to ship quickly while leaving room for later phone verification and stronger anti-abuse rules.

## 3. Role Capabilities

### 3.1 Visitor

- Open a public question box page by URL.
- Read published questions and answers.
- Submit an anonymous question with text and an optional image.
- Receive only minimal submission feedback, without account creation.

### 3.2 User

- Register with phone number, password, and invite code.
- Log in and manage their own account.
- Create multiple question boxes.
- Edit each box's title, description, slug, and accepting-questions status.
- Review pending questions.
- Reject, delete, answer, and publish questions.
- Manage published content inside each box.

### 3.3 Admin

- View all users, boxes, questions, answers, and invite codes.
- Search and filter platform data.
- Disable users or boxes.
- Delete inappropriate questions or answers.
- Create and manage invite codes, including usage limits and expiration.
- View operation history through admin logs.

## 4. Core User Flows

### 4.1 Registration

1. A new user enters phone number, password, and invite code.
2. The backend validates phone format and uniqueness.
3. The backend validates the invite code and remaining usage count.
4. The account is created and the password is securely hashed.
5. The user is signed in and redirected to the dashboard.

Notes:

- Phone verification by SMS is not included in the first version.
- A future upgrade can activate SMS verification without redesigning the account model.

### 4.2 Create a Question Box

1. A signed-in user creates a new box.
2. The user sets title, description, and slug.
3. The system generates a public URL from the slug.
4. The box becomes available for visitor submissions when enabled.

### 4.3 Anonymous Submission

1. A visitor opens a public box page.
2. The visitor writes a question and may attach one image.
3. The system validates content length, file type, and submission rate.
4. The question is stored as pending.
5. The user sees it later in their inbox.

### 4.4 Review and Publish

1. The user opens a box management page.
2. The user reviews pending questions.
3. The user can reject the question, delete it, or write an answer.
4. Once published, the Q&A appears on the public box page.

## 5. MVP Scope

### Included

- Web application
- React-based frontend
- Material Design 2 visual language
- User registration and login
- Multi-box ownership per user
- Public box pages
- Anonymous question submission
- Pending review workflow
- Published Q&A display
- Admin management console
- Invite code management
- Docker-based local environment

### Not Included

- SMS verification
- Social login
- Reactions, likes, or comments
- Real-time notifications
- AI moderation
- Full audit analytics dashboards
- Multi-language support

## 6. Content and Moderation Rules

- Questions support plain text plus one optional image.
- Answers support plain text plus one optional image.
- Newly submitted questions are not public by default.
- Deleted content should be soft deleted where possible to preserve moderation history.
- Basic anti-abuse controls should be part of the MVP:
  - Rate limiting by IP and box
  - Content length limits
  - File type and file size restrictions
  - Admin deletion and account disabling

## 7. Design Language

- Use Material Design 2 as the default UI language.
- Prefer clear elevation layers, card grouping, and strong visual hierarchy.
- Avoid overly glossy or futuristic styling that conflicts with MD2.
- Public pages should feel lightweight and approachable.
- Dashboard pages should feel structured and operational without looking generic.

## 8. Success Criteria for MVP

- A new user can register and create a question box without manual database setup.
- A visitor can submit a question in under one minute.
- A user can review and publish a question from the dashboard.
- An admin can find and remove inappropriate content.
- The full stack can be started with Docker Compose in a local environment.
