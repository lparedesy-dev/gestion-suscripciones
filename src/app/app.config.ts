import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SubscriptionRepository } from './core/domain/repositories/subscription.repository';
import { LocalStorageSubscriptionRepository } from './infrastructure/repositories/local-storage-subscription.repository';
import { ThemePort } from './core/application/ports/theme.port';
import { ThemeAdapter } from './infrastructure/adapters/theme.adapter';
import { NotificationPort } from './core/application/ports/notification.port';
import { BrowserNotificationAdapter } from './infrastructure/adapters/browser-notification.adapter';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: SubscriptionRepository,
      useClass: LocalStorageSubscriptionRepository,
    },
    { provide: ThemePort, useExisting: ThemeAdapter },
    { provide: NotificationPort, useExisting: BrowserNotificationAdapter },
    ConfirmationService,
    MessageService,
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
