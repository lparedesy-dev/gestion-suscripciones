import { inject, Injectable } from '@angular/core';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { Subscription } from '../entities/subscription.entity';

@Injectable({ providedIn: 'root' })
export class GetSubscriptionsUseCase {
  private readonly repo = inject(SubscriptionRepository);

  execute(): Subscription[] {
    return this.repo.getAll();
  }
}
