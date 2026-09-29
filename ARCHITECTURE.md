# Travally Architecture Guide

Welcome to the Travally codebase! This project is built using the **Next.js App Router**, which is a full-stack framework. 

Unlike older architectures that have completely separate `frontend` and `backend` repositories, Next.js combines them into a single, unified codebase (a "monolith"). This is the industry standard for modern React applications and is required for our Vercel deployment to work correctly.

To help you navigate the codebase easily, here is the mental map of where the Frontend and Backend live within the `src/` directory.

## 🎨 Frontend (Client-Side & UI)

These folders contain everything the user sees and interacts with in the browser.

*   **`src/app/(routes)`** (excluding `api/`): This is the frontend routing layer. Every folder here (like `src/app/chats`, `src/app/discover`) represents a physical URL the user can visit.
*   **`src/components/`**: All reusable React components (buttons, layout, chat bubbles).
*   **`src/hooks/`**: Custom React hooks for managing frontend state (e.g., `useBadges`, `useChatMessages`).
*   **`src/context/`**: React Context providers (like `AuthContext.tsx`) for global frontend state.

## ⚙️ Backend (Server-Side & API)

These folders contain code that **only runs on the server**. They handle database connections, security, and business logic.

*   **`src/app/api/`**: Our REST API endpoints. This is the equivalent of an Express.js router. The frontend makes HTTP requests to these routes.
*   **`src/server/services/`**: The core backend business logic. For example, `chatService.ts` handles all database interactions for messaging. Keeping this logic here keeps our API routes clean.
*   **`prisma/`**: Our database schema (`schema.prisma`) and configuration. This defines the MongoDB structure.
*   **`src/lib/`**: Shared backend utilities (like `db.ts` for database connections, `auth.ts` for session verification, and `scoring.ts` for compatibility logic).

## Why not split them into two root folders?
You might wonder why we don't just create a `frontend/` folder and a `backend/` folder at the root of the project. 

Next.js relies on a strict file-system routing mechanism (the `src/app` directory). Moving API routes out of `src/app/api` or moving pages out of `src/app` would completely break the framework's routing, server-side rendering, and Vercel build process. The current structure is the industry best practice for Next.js and will be immediately familiar to any experienced React developer joining the team.
