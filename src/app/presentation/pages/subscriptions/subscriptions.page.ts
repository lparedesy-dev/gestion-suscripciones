import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SubscriptionService } from '../../../core/application/services/subscription.service';
import { SubscriptionCardComponent } from '../../components/subscription-card/subscription-card.component';
import { SubscriptionStatus } from '../../../core/domain/entities/subscription.entity';

type FilterStatus = SubscriptionStatus | 'all';

@Component({
  selector: 'app-subscriptions-page',
  imports: [RouterLink, ButtonModule, SubscriptionCardComponent],
  templateUrl: './subscriptions.page.html',
})
export class SubscriptionsPage implements OnInit {
  readonly subService = inject(SubscriptionService);
  readonly activeFilter = signal<FilterStatus>('all');

  readonly filters: { label: string; value: FilterStatus }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Activas', value: 'active' },
    { label: 'Pausadas', value: 'paused' },
    { label: 'Canceladas', value: 'cancelled' },
  ];

  ngOnInit(): void {
    this.subService.load();
  }

  get filtered() {
    const f = this.activeFilter();
    if (f === 'all') return this.subService.subscriptions();
    return this.subService.subscriptions().filter(s => s.status === f);
  }

  setFilter(value: FilterStatus): void {
    this.activeFilter.set(value);
  }
}
