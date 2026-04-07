import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SubscriptionStore } from '../../stores/subscription.store';
import { SubscriptionCardComponent } from '../../components/subscription-card/subscription-card.component';
import { GlassCardComponent } from '../../components/glass-card/glass-card.component';
import { SubscriptionStatus } from '../../../core/domain/entities/subscription.entity';

type FilterStatus = SubscriptionStatus | 'all';

@Component({
  selector: 'app-subscriptions-page',
  imports: [RouterLink, FormsModule, ButtonModule, SelectButtonModule, SubscriptionCardComponent, GlassCardComponent],
  templateUrl: './subscriptions.page.html',
})
export class SubscriptionsPage implements OnInit {
  readonly store = inject(SubscriptionStore);
  readonly activeFilter = signal<FilterStatus>('all');

  readonly filters: { label: string; value: FilterStatus }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Activas', value: 'active' },
    { label: 'Pausadas', value: 'paused' },
    { label: 'Canceladas', value: 'cancelled' },
  ];

  ngOnInit(): void {
    this.store.load();
  }

  get filtered() {
    const f = this.activeFilter();
    if (f === 'all') return this.store.subscriptions();
    return this.store.subscriptions().filter(s => s.status === f);
  }

  setFilter(value: FilterStatus): void {
    this.activeFilter.set(value);
  }
}
