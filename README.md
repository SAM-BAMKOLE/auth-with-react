# React Auth (Vite + TypeScript)

A small starter kit demonstrating a React + TypeScript app bootstrapped with Vite.
This project includes a simple authentication UI (signup/signin) and a thin client-side API layer built with Axios and Zustand for auth state.

This README covers how to run the project, environment variables, debugging tips (especially for Axios + auth issues), and a short development checklist.

## Table of contents

- Getting started
- Project structure
- Scripts
- Environment variables
- Common issues & debugging
  - Axios + interceptors
  - Zustand `useAuthStore` common mistakes
  - Dev server / network issues
- Testing the signup flow locally
- Contributing
- License

## Getting started

Requirements

- Node.js 18+ (recommended)
- pnpm (recommended) or npm/yarn

Install dependencies:

```powershell
pnpm install
```

Start the dev server:

```powershell
pnpm dev
```

The app should open on http://localhost:5173 (Vite may pick another port if 5173 is occupied).

Build for production:

```powershell
pnpm build
pnpm preview
```

## Project structure (important files)

- `index.html` — Vite entry
- `src/main.tsx` — React app bootstrap
- `src/router.tsx` — App routes
- `src/pages/` — Page-level components (home, signin, signup, dashboard)
- `src/components/` — Reusable UI components and forms
- `src/utils/axios.ts` — Central axios instance with interceptors
- `src/utils/helpers.ts` — Small helper wrappers that call API endpoints
- `src/store/auth.ts` — Zustand store for authentication state
- `src/utils/*` and `src/lib/*` — Utility functions

## Scripts

- `pnpm dev` — Start development server (Vite)
- `pnpm build` — Type-check and build
- `pnpm preview` — Preview production build locally
- `pnpm lint` — Run ESLint

## Environment variables

This project reads environment variables via Vite's `import.meta.env`. Example vars used in code:

- `VITE_BASE_URL` — Base URL for API when running in PROD mode (used in `src/utils/axios.ts`).

Local development: by default the axios instance uses `http://localhost:3550` unless `import.meta.env.PROD` is truthy and `VITE_BASE_URL` is set. Create a `.env` file in the project root if you want to set `VITE_BASE_URL` for preview or production builds:

```
VITE_BASE_URL=https://api.example.com
```

Remember: Vite exposes only variables prefixed with `VITE_` to the client.

## Common issues & debugging

Below are targeted troubleshooting steps for common problems you may run into while working on the auth flow.

1. TypeError: Cannot read properties of undefined (reading 'data')

- Symptom: You call an axios wrapper and the code tries to read `response.data`, but `response` is `undefined`.
- Likely causes:
  - An axios response interceptor may be swallowing or returning undefined when handling errors. Ensure your response interceptor either returns a value or rejects the promise with `Promise.reject(error)` so the caller's `catch` runs.
  - The network request never fired because the caller never awaited the async function, or the UI prevented submission.
- How to debug:
  - Add console logs before and after the call in the helper (e.g. `console.log('axiosInstance', axiosInstance)` and `console.log('response', response)`).
  - Inspect browser DevTools > Network to see whether the POST request appears.

2. TypeError: useAuthStore.getState(...).accessToken is not a function

- Symptom: Runtime error thrown from `src/utils/axios.ts` when building the Authorization header.
- Root cause: `accessToken` in the Zustand store is a value (`string | null`) and not a function. Calling it like `accessToken()` throws the error.
- Fix: Access the property directly: `const accessToken = useAuthStore.getState().accessToken;`
- Also ensure `setAccessToken` and `logout` are functions on the store in `src/store/auth.ts`.

3. No network request seen in browser

- Symptom: You call the API wrapper but nothing shows up in the Network tab.
- Common causes:
  - The form submit handler isn't awaiting the async call, so errors are swallowed. Use `await userSignup(...)` inside an async handler.
  - Interceptors returned a resolved value of `undefined`. Ensure interceptors either return the config/response or properly reject when an error occurs.
  - CORS or browser blocking — check console for blocked requests.

4. Dev server port conflict

- Vite will attempt another port if 5173 is in use. Check the terminal output for the actual port.

## Debugging tips specific to this project

- Check `src/utils/axios.ts` for these patterns:

  - Request interceptor should read `accessToken` as a value from the store and set `config.headers.Authorization` only when a token exists.
  - Response interceptor should `return Promise.reject(error)` for non-refreshable errors to keep callers' catch blocks working.

- Check `src/components/register-form.tsx` (or other forms) to ensure they `await` the API helpers, for example:

```tsx
const result = await userSignup(submitData);
```

- If you see type errors like "must be imported using a type-only import", fix them by switching to `import type` for purely-type imports:

```ts
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
```

or single-line:

```ts
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
```

## Testing the signup flow locally

1. Start the frontend:

```powershell
pnpm dev
```

2. If you have a local backend, start it (by default the frontend expects `http://localhost:3550`).

3. Open the signup page, fill details, submit, then check:

- Network tab: POST `/api/auth/signup` request
- Console: any logs or error traces

If the backend is not running, you'll see network errors in DevTools. If your backend is protected by CORS, configure the backend to allow requests from the frontend origin (e.g., `http://localhost:5173`).

## Contributing

- Create a branch per change: `feature/*` or `fix/*`
- Run tests & lint before opening a PR (project includes lint script)

## Notes

- This project is intentionally minimal. Please add tests and stricter type rules for production readiness.

---

If you'd like, I can also:

- Fix the two type-only import errors reported during `pnpm build`.
- Remove the debug console logs I added earlier.

Tell me which follow-up you'd like and I'll apply it.
