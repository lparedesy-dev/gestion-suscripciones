import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { SubscriptionStore } from '../../stores/subscription.store';
import { NotificationPort } from '../../../core/application/ports/notification.port';
import { ThemePort } from '../../../core/application/ports/theme.port';
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
  readonly store = inject(SubscriptionStore);
  readonly notifPort = inject(NotificationPort);
  private readonly themePort = inject(ThemePort);

  private readonly palette = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981',
    '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6',
    '#f97316', '#06b6d4',
  ];

  readonly spendingDonutData = computed(() => {
    const subs = this.store.subscriptions().filter(s => s.status === 'active');
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
    const subs = this.store.subscriptions()
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

  readonly donutOptions = computed(() => {
    const textColor = this.themePort.isDark() ? '#94a3b8' : '#64748b';
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            color: textColor,
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
  });

  readonly barOptions = computed(() => {
    const textColor = this.themePort.isDark() ? '#94a3b8' : '#64748b';
    const gridColor = this.themePort.isDark() ? 'rgba(148,163,184,0.08)' : 'rgba(100,116,139,0.12)';
    return {
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
          ticks: { color: textColor, font: { size: 11 } },
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 11 } },
          beginAtZero: true,
        },
      },
    };
  });

  ngOnInit(): void {
    this.store.load();
  }
}
