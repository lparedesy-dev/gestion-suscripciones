import { computed, inject, Injectable, signal } from '@angular/core';
import { CreateSubscriptionUseCase } from '../../domain/use-cases/create-subscription.use-case';
import { DeleteSubscriptionUseCase } from '../../domain/use-cases/delete-subscription.use-case';
import { GetSubscriptionsUseCase } from '../../domain/use-cases/get-subscriptions.use-case';
import { UpdateSubscriptionUseCase } from '../../domain/use-cases/update-subscription.use-case';
import { CheckRenewalsUseCase } from '../../domain/use-cases/check-renewals.use-case';
import { CreateSubscriptionDto, RenewalAlert, Subscription, UpdateSubscriptionDto } from '../../domain/entities/subscription.entity';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly getAll = inject(GetSubscriptionsUseCase);
  private readonly createUC = inject(CreateSubscriptionUseCase);
  private readonly updateUC = inject(UpdateSubscriptionUseCase);
  private readonly deleteUC = inject(DeleteSubscriptionUseCase);
  private readonly checkRenewals = inject(CheckRenewalsUseCase);

  readonly subscriptions = signal<Subscription[]>([]);
  readonly renewalAlerts = signal<RenewalAlert[]>([]);

  readonly totalMonthlyCost = computed(() => {
    return this.subscriptions()
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        const monthly = s.billingCycle === 'annual' ? s.cost / 12 : s.cost;
        return sum + monthly;
      }, 0);
  });

  readonly totalAnnualCost = computed(() => this.totalMonthlyCost() * 12);

  readonly costsByCurrency = computed(() => {
    const map = new Map<string, { monthly: number; annual: number }>();
    this.subscriptions()
      .filter(s => s.status === 'active')
      .forEach(s => {
        const cur = s.currency ?? 'USD';
        const entry = map.get(cur) ?? { monthly: 0, annual: 0 };
        const monthly = s.billingCycle === 'annual' ? s.cost / 12 : s.cost;
        entry.monthly += monthly;
        entry.annual += monthly * 12;
        map.set(cur, entry);
      });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([currency, totals]) => ({ currency, ...totals }));
  });

  readonly activeCount = computed(() => this.subscriptions().filter(s => s.status === 'active').length);

  load(): void {
    this.subscriptions.set(this.getAll.execute());
    this.renewalAlerts.set(this.checkRenewals.execute());
  }

  create(dto: CreateSubscriptionDto): Subscription {
    const created = this.createUC.execute(dto);
    this.load();
    return created;
  }

  update(id: string, dto: UpdateSubscriptionDto): Subscription | undefined {
    const updated = this.updateUC.execute(id, dto);
    this.load();
    return updated;
  }

  delete(id: string): boolean {
    const result = this.deleteUC.execute(id);
    this.load();
    return result;
  }

  getById(id: string): Subscription | undefined {
    return this.subscriptions().find(s => s.id === id);
  }
}
