# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server → http://localhost:4200
npm run build      # Production build
npm test           # Run tests with Vitest via ng test
```

There is no standalone Vitest config — tests run through the Angular CLI (`ng test`). Test files use the `*.spec.ts` pattern and Vitest globals (configured in `tsconfig.spec.json`).

## Architecture

The project implements **Clean Architecture** with three strict layers:

```
src/app/
├── core/
│   ├── domain/          # Pure business logic — no Angular dependencies
│   │   ├── entities/    # Subscription, RenewalAlert, DTOs
│   │   ├── repositories/ # SubscriptionRepository (abstract class / DI token)
│   │   └── use-cases/   # One file per operation (get / create / update / delete / check-renewals)
│   └── application/
│       └── services/    # SubscriptionService · NotificationService · ThemeService
│
├── infrastructure/
│   └── repositories/    # LocalStorageSubscriptionRepository (concrete impl)
│
└── presentation/
    ├── components/      # GlassCard · Navbar · SubscriptionCard · RenewalAlertBanner
    └── pages/           # Dashboard · Subscriptions · SubscriptionForm (lazy-loaded)
```

**Key architectural rules:**

- `SubscriptionRepository` is an **abstract class used as a DI token**. It is provided in `app.config.ts` with `useClass: LocalStorageSubscriptionRepository`. Use cases and services inject the abstract — never the concrete.
- Use cases are **`@Injectable({ providedIn: 'root' })`** — they live in `domain/`, inject the abstract repo, and expose a single `execute()` method.
- `SubscriptionService` (application layer) owns the **Signals state** (`subscriptions`, `renewalAlerts`, computed costs). Pages inject this service — never use cases directly.
- All components are **standalone** — no NgModules anywhere.
- State is managed with Angular **Signals** (`signal()`, `computed()`). RxJS is not used for app state.
- Pages are **lazy-loaded** via `loadComponent` in `app.routes.ts`.

## Styling

- **Tailwind CSS v4** + **PrimeNG 21** (Aura preset) coexist.
- PrimeNG dark mode uses `.p-dark` on `<html>` (toggled by `ThemeService`). Tailwind is wired to this via `@variant dark (&:where(.p-dark, .p-dark *))` in `styles.css`.
- The glassmorphism card style is the `.card-glass` class defined in `styles.css`. Use `<app-glass-card>` component or the CSS class directly — do NOT inline the `box-shadow`/`backdrop-filter` stack.
- Theme preference is persisted in `localStorage` under the key `ctrl_theme`.

## Data persistence

All data lives in `localStorage` under the key `ctrl_subscriptions`. There is no backend. The `LocalStorageSubscriptionRepository` reads/writes on every operation (no in-memory cache). `SubscriptionService.load()` must be called after any mutation to refresh signals.

## Key design decisions

- **`renewalDay` (1–31) + `renewalMonth` (1–12, annual only)** define renewal dates — NOT a stored ISO date string. `CheckRenewalsUseCase` computes the next renewal dynamically against today.
- **`billingCycle: 'monthly' | 'annual'`** — annual cost is always stored as the full-year amount; monthly equivalent is `cost / 12`.
- **Multi-currency** — `costsByCurrency` computed signal groups totals by `currency` (defaults to `'USD'` if absent).
