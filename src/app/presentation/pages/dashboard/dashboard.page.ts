import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { SubscriptionService } from '../../../core/application/services/subscription.service';
import { NotificationService } from '../../../core/application/services/notification.service';
import { SubscriptionCardComponent } from '../../components/subscription-card/subscription-card.component';
import { RenewalAlertBannerComponent } from '../../components/renewal-alert-banner/renewal-alert-banner.component';
import { GlassCardComponent } from '../../components/glass-card/glass-card.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    RouterLink,
    DecimalPipe,
    ButtonModule,
    TagModule,
    ChartModule,
    SubscriptionCardComponent,
    RenewalAlertBannerComponent,
    GlassCardComponent,
  ],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {
  readonly subService = inject(SubscriptionService);
  readonly notifService = inject(NotificationService);

  private readonly palette = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981',
    '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6',
    '#f97316', '#06b6d4',
  ];

  readonly spendingDonutData = computed(() => {
    const subs = this.subService.subscriptions().filter(s => s.status === 'active');
    return {
      labels: subs.map(s => s.name),
      datasets: [{
        data: subs.map(s => +(s.billingCycle === 'annual' ? s.cost / 12 : s.cost).toFixed(2)),
        backgroundColor: this.palette.slice(0, subs.length),
        borderWidth: 0,
        hoverOffset: 6,
      }],
    };
  });

  readonly spendingBarData = computed(() => {
    const subs = this.subService.subscriptions()
      .filter(s => s.status === 'active')
      .map(s => ({
        name: s.name,
        monthly: +(s.billingCycle === 'annual' ? s.cost / 12 : s.cost).toFixed(2),
      }))
      .sort((a, b) => b.monthly - a.monthly)
      .slice(0, 8);

    return {
      labels: subs.map(s => s.name),
      datasets: [{
        label: 'Costo mensual',
        data: subs.map(s => s.monthly),
        backgroundColor: this.palette.slice(0, subs.length),
        borderRadius: 8,
        borderWidth: 0,
      }],
    };
  });

  readonly donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#94a3b8',
          font: { size: 12 },
          padding: 14,
          usePointStyle: true,
          pointStyle: 'circle' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `  $${ctx.raw} / mes`,
        },
      },
    },
  };

  readonly barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `  $${ctx.raw} / mes`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148,163,184,0.08)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  ngOnInit(): void {
    this.subService.load();
  }
}
