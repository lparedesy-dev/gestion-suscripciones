import { inject, Injectable } from '@angular/core';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { UpdateSubscriptionDto, Subscription } from '../../domain/entities/subscription.entity';

@Injectable({ providedIn: 'root' })
export class UpdateSubscriptionUseCase {
  private readonly repo = inject(SubscriptionRepository);

  execute(id: string, dto: UpdateSubscriptionDto): Subscription | undefined {
    return this.repo.update(id, dto);
  }
}
