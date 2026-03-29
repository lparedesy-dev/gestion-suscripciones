import { inject, Injectable } from '@angular/core';
import { SubscriptionRepository } from '../repositories/subscription.repository';

@Injectable({ providedIn: 'root' })
export class DeleteSubscriptionUseCase {
  private readonly repo = inject(SubscriptionRepository);

  execute(id: string): boolean {
    return this.repo.delete(id);
  }
}
