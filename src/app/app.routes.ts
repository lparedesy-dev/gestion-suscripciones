import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/pages/dashboard/dashboard.page').then(m => m.DashboardPage),
  },
  {
    path: 'subscriptions',
    loadComponent: () => import('./presentation/pages/subscriptions/subscriptions.page').then(m => m.SubscriptionsPage),
  },
  {
    path: 'subscriptions/new',
    loadComponent: () => import('./presentation/pages/subscription-form/subscription-form.page').then(m => m.SubscriptionFormPage),
  },
  {
    path: 'subscriptions/:id/edit',
    loadComponent: () => import('./presentation/pages/subscription-form/subscription-form.page').then(m => m.SubscriptionFormPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
