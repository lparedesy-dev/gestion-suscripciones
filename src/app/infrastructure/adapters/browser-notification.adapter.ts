import { Injectable, signal } from '@angular/core';
import { NotificationPort } from '../../core/application/ports/notification.port';
import { RenewalAlert } from '../../core/domain/entities/subscription.entity';

@Injectable({ providedIn: 'root' })
export class BrowserNotificationAdapter extends NotificationPort {
  readonly permissionGranted = signal<boolean>(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

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

  notify(alerts: RenewalAlert[]): void {
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
