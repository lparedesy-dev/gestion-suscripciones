import { Subscription } from '../entities/subscription.entity';

export function getNextRenewalDate(sub: Subscription, today: Date): Date {
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
