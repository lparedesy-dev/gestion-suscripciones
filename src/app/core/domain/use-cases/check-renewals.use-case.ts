import { inject, Injectable } from '@angular/core';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { RenewalAlert, Subscription } from '../entities/subscription.entity';

function getNextRenewalDate(sub: Subscription, today: Date): Date {
  if (sub.billingCycle === 'monthly') {
    let date = new Date(today.getFullYear(), today.getMonth(), sub.renewalDay);
    if (date.getTime() < today.getTime()) {
      date = new Date(today.getFullYear(), today.getMonth() + 1, sub.renewalDay);
    }
    return date;
  } else {
    const month = (sub.renewalMonth ?? 1) - 1; // 0-indexed
    let date = new Date(today.getFullYear(), month, sub.renewalDay);
    if (date.getTime() < today.getTime()) {
      date = new Date(today.getFullYear() + 1, month, sub.renewalDay);
    }
    return date;
  }
}

@Injectable({ providedIn: 'root' })
export class CheckRenewalsUseCase {
  private readonly repo = inject(SubscriptionRepository);

  execute(): RenewalAlert[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.repo
      .getAll()
      .filter(sub => sub.status === 'active' && sub.notifications.enabled)
      .map(sub => {
        const nextRenewal = getNextRenewalDate(sub, today);
        const diffMs = nextRenewal.getTime() - today.getTime();
        const daysUntilRenewal = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return { subscription: sub, daysUntilRenewal };
      })
      .filter(alert => alert.daysUntilRenewal <= alert.subscription.notifications.daysBeforeRenewal)
      .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);
  }
}
