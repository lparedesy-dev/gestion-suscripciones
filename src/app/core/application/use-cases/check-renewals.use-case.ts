import { inject, Injectable } from '@angular/core';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { RenewalAlert } from '../../domain/entities/subscription.entity';
import { getNextRenewalDate } from '../../domain/functions/renewal-date.fn';

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
