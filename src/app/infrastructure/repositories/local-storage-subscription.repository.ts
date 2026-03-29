import { Injectable } from '@angular/core';
import { SubscriptionRepository } from '../../core/domain/repositories/subscription.repository';
import { Subscription, CreateSubscriptionDto, UpdateSubscriptionDto } from '../../core/domain/entities/subscription.entity';

const STORAGE_KEY = 'ctrl_subscriptions';

@Injectable()
export class LocalStorageSubscriptionRepository extends SubscriptionRepository {

  private load(): Subscription[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Subscription[];
    } catch {
      return [];
    }
  }

  private save(subscriptions: Subscription[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  getAll(): Subscription[] {
    return this.load();
  }

  getById(id: string): Subscription | undefined {
    return this.load().find(s => s.id === id);
  }

  create(dto: CreateSubscriptionDto): Subscription {
    const now = new Date().toISOString();
    const subscription: Subscription = {
      ...dto,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const all = this.load();
    all.push(subscription);
    this.save(all);
    return subscription;
  }

  update(id: string, dto: UpdateSubscriptionDto): Subscription | undefined {
    const all = this.load();
    const index = all.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    const updated: Subscription = {
      ...all[index],
      ...dto,
      id,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updated;
    this.save(all);
    return updated;
  }

  delete(id: string): boolean {
    const all = this.load();
    const filtered = all.filter(s => s.id !== id);
    if (filtered.length === all.length) return false;
    this.save(filtered);
    return true;
  }
}
