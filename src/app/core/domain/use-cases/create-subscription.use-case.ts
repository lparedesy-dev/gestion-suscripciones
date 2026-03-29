import { inject, Injectable } from '@angular/core';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { CreateSubscriptionDto, Subscription } from '../entities/subscription.entity';

@Injectable({ providedIn: 'root' })
export class CreateSubscriptionUseCase {
  private readonly repo = inject(SubscriptionRepository);

  execute(dto: CreateSubscriptionDto): Subscription {
    return this.repo.create(dto);
  }
}
