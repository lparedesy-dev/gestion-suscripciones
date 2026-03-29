import { inject, Injectable } from '@angular/core';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { UpdateSubscriptionDto, Subscription } from '../entities/subscription.entity';

@Injectable({ providedIn: 'root' })
export class UpdateSubscriptionUseCase {
  private readonly repo = inject(SubscriptionRepository);

  execute(id: string, dto: UpdateSubscriptionDto): Subscription | undefined {
    return this.repo.update(id, dto);
  }
}
