import { inject, Injectable } from '@angular/core';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { CreateSubscriptionDto, Subscription } from '../../domain/entities/subscription.entity';

@Injectable({ providedIn: 'root' })
export class CreateSubscriptionUseCase {
  private readonly repo = inject(SubscriptionRepository);

  execute(dto: CreateSubscriptionDto): Subscription {
    return this.repo.create(dto);
  }
}
