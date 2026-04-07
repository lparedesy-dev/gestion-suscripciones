import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubscriptionStore } from './presentation/stores/subscription.store';
import { NotificationPort } from './core/application/ports/notification.port';
import { ThemePort } from './core/application/ports/theme.port';
import { NavbarComponent } from './presentation/components/navbar/navbar.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToastModule, ConfirmDialogModule],
  template: `
    <div class="relative min-h-screen pb-20 overflow-hidden
      bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100
      dark:from-slate-900 dark:via-blue-950 dark:to-slate-900
      text-[var(--p-text-color)] transition-colors duration-300">

      <!-- ── Decorative background layer ─────────────────────────────── -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden -z-0">

        <!-- Orb top-left -->
        <div class="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full
                    bg-blue-400/40 dark:bg-blue-600/25 blur-3xl"></div>

        <!-- Orb bottom-right -->
        <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full
                    bg-indigo-400/40 dark:bg-indigo-700/25 blur-3xl"></div>

        <!-- Orb center accent -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[400px] h-[300px] rounded-full
                    bg-slate-300/30 dark:bg-blue-900/20 blur-3xl"></div>

        <!-- SVG curved ribbon crossing top-left → bottom-right -->
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1440 900"
             preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="ribbon-blur">
              <feGaussianBlur stdDeviation="8"/>
            </filter>
          </defs>

          <!-- Ribbon band: upper edge curves from top-left to bottom-right -->
          <path d="M -100,80
                   C 200,-20 500,180 780,120
                   S 1150,20  1550,200
                   L 1550,440
                   C 1150,260 780,360  500,320
                   S 200,160 -100,280
                   Z"
                class="bg-ribbon"
                filter="url(#ribbon-blur)"/>
        </svg>
      </div>
      <!-- ── End decorative layer ─────────────────────────────────────── -->

      <div class="relative z-10">
        <p-toast />
        <p-confirmDialog />
        <app-navbar />
        <router-outlet />
      </div>
    </div>
  `,
})
export class App implements OnInit {
  private readonly store = inject(SubscriptionStore);
  private readonly notifPort = inject(NotificationPort);
  private readonly themePort = inject(ThemePort);
  private readonly primeng = inject(PrimeNG);

  ngOnInit(): void {
    this.themePort.init();
    this.store.load();
    this.notifPort.notify(this.store.renewalAlerts());
    this.primeng.ripple.set(true);
  }
}
