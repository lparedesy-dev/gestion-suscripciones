import { inject, Injectable, signal } from '@angular/core';
import { SubscriptionService } from './subscription.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly subscriptionService = inject(SubscriptionService);

  readonly permissionGranted = signal<boolean>(Notification.permission === 'granted');

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') {
      this.permissionGranted.set(true);
      return true;
    }
    const result = await Notification.requestPermission();
    const granted = result === 'granted';
    this.permissionGranted.set(granted);
    return granted;
  }

  checkAndNotify(): void {
    const alerts = this.subscriptionService.renewalAlerts();
    if (!alerts.length) return;

    for (const alert of alerts) {
      const { subscription, daysUntilRenewal } = alert;

      const title = daysUntilRenewal === 0
        ? `${subscription.name} se renueva HOY`
        : `${subscription.name} se renueva en ${daysUntilRenewal} día${daysUntilRenewal === 1 ? '' : 's'}`;

      const body = `Costo: $${subscription.cost} (${subscription.billingCycle === 'monthly' ? 'mensual' : 'anual'}). Cuenta: ${subscription.email}`;

      if (this.permissionGranted()) {
        new Notification(title, { body, icon: subscription.logoUrl ?? '/favicon.ico' });
      }
    }
  }
}
