export type BillingCycle = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface NotificationConfig {
  enabled: boolean;
  daysBeforeRenewal: number;
}

export interface Subscription {
  id: string;
  name: string;
  email: string;
  password?: string;
  cost: number;
  currency?: string;
  billingCycle: BillingCycle;
  renewalDay: number;    // 1-31
  renewalMonth?: number; // 1-12, only for annual
  paymentMethod: string;
  status: SubscriptionStatus;
  logoUrl?: string;
  color?: string;
  notifications: NotificationConfig;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export type CreateSubscriptionDto = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSubscriptionDto = Partial<CreateSubscriptionDto>;

export interface RenewalAlert {
  subscription: Subscription;
  daysUntilRenewal: number;
}
