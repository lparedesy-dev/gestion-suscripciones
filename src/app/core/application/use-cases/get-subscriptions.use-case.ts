import { inject, Injectable } from '@angular/core';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { Subscription } from '../../domain/entities/subscription.entity';

@Injectable({ providedIn: 'root' })
export class GetSubscriptionsUseCase {
  private readonly repo = inject(SubscriptionRepository);

  execute(): Subscription[] {
    return this.repo.getAll();
  }
}
