import { Subscription, CreateSubscriptionDto, UpdateSubscriptionDto } from '../entities/subscription.entity';

export abstract class SubscriptionRepository {
  abstract getAll(): Subscription[];
  abstract getById(id: string): Subscription | undefined;
  abstract create(dto: CreateSubscriptionDto): Subscription;
  abstract update(id: string, dto: UpdateSubscriptionDto): Subscription | undefined;
  abstract delete(id: string): boolean;
}
