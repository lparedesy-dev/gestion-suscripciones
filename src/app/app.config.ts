import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SubscriptionRepository } from './core/domain/repositories/subscription.repository';
import { LocalStorageSubscriptionRepository } from './infrastructure/repositories/local-storage-subscription.repository';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: SubscriptionRepository,
      useClass: LocalStorageSubscriptionRepository,
    },
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.p-dark',
          // cssLayer: {
          //   name: 'primeng',
          //   order: 'tailwind-base, primeng, tailwind-utilities',
          // },
        },
      },
    })
  ]
};
