# 💳 Control de Suscripciones

Una aplicación web moderna para gestionar y visualizar todas tus suscripciones digitales en un solo lugar. Construida con Angular 21, arquitectura limpia y una interfaz glassmorphism con soporte completo para modo oscuro.

---

## Características

- **Dashboard con métricas** — suscripciones activas, gasto mensual y anual por moneda, con gráficos de distribución y ranking
- **CRUD completo** — crear, editar y eliminar suscripciones con formulario validado
- **Alertas de renovación** — notificaciones configurables con días de anticipación a la fecha de vencimiento
- **Filtros y búsqueda** — filtrá por estado y buscá por nombre en el listado
- **Modo oscuro / claro** — toggle persistente integrado en el header
- **Glassmorphism UI** — cards con efecto de vidrio, relieve físico y animación de hover
- **Mobile-first** — navegación por bottom navbar adaptada a móvil y escritorio
- **Persistencia local** — los datos se almacenan en `localStorage`, sin backend requerido

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Angular 21 (Standalone Components, Signals) |
| UI | PrimeNG 21 + PrimeIcons + Aura Theme |
| Estilos | Tailwind CSS 4 |
| Gráficos | Chart.js 4 vía `p-chart` |
| Testing | Vitest |
| Build | Angular CLI + Vite |

---

## Arquitectura

El proyecto implementa **Clean Architecture** con separación estricta de capas:

```
src/app/
├── core/
│   ├── domain/
│   │   ├── entities/          # Subscription entity
│   │   ├── repositories/      # SubscriptionRepository (contrato abstracto)
│   │   └── use-cases/         # get / create / update / delete / check-renewals
│   └── application/
│       └── services/          # SubscriptionService · NotificationService · ThemeService
│
├── infrastructure/
│   └── repositories/          # LocalStorageSubscriptionRepository
│
└── presentation/
    ├── components/            # GlassCard · Navbar · SubscriptionCard · RenewalAlertBanner
    └── pages/                 # Dashboard · Subscriptions · SubscriptionForm
```

**Principios aplicados:**
- Inversión de dependencias — `SubscriptionRepository` es un token abstracto inyectado en `app.config.ts`
- Casos de uso atómicos — cada operación de dominio vive en su propio archivo
- Componentes standalone — sin NgModules
- Signals de Angular para estado reactivo

---

## Requisitos

- Node.js 20+
- npm 11+

---

## Instalación y uso

```bash
# Clonar el repositorio
git clone <repo-url>
cd control-subscripcion

# Instalar dependencias
npm install

# Servidor de desarrollo
npm start
# → http://localhost:4200
```

```bash
# Build de producción
npm run build

# Tests
npm test
```

---

## Estructura de una suscripción

```ts
interface Subscription {
  id: string
  name: string
  email: string
  cost: number
  currency: string           // 'USD' | 'ARS' | ...
  billingCycle: 'monthly' | 'annual' | 'weekly'
  renewalDate: string        // ISO date
  status: 'active' | 'inactive' | 'cancelled'
  color?: string             // color del avatar si no hay logo
  logoUrl?: string
  notifications: {
    enabled: boolean
    daysBeforeRenewal: number
  }
}
```

---

## Decisiones de diseño

- **localStorage como repositorio** — permite usar la app sin ningún backend. La abstracción de `SubscriptionRepository` facilita reemplazarlo por una API REST o IndexedDB sin tocar ninguna capa superior.
- **Signals sobre RxJS** — el estado de suscripciones se gestiona con `signal()` y `computed()` de Angular, evitando la complejidad de Observables para este caso de uso.
- **PrimeNG + Tailwind coexistiendo** — el dark mode de PrimeNG usa el selector `.p-dark` en lugar del estándar `prefers-color-scheme`, por lo que Tailwind se configura con `@variant dark` apuntando a esa misma clase.
- **Glassmorphism con grosor físico** — las cards usan `box-shadow` en capas para simular el canto de una tarjeta gruesa, con `backdrop-filter: blur()` para el efecto de vidrio.
