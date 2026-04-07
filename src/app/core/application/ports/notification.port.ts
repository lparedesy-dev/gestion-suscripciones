import { RenewalAlert } from '../../domain/entities/subscription.entity';

export abstract class NotificationPort {
  abstract readonly permissionGranted: () => boolean;
  abstract requestPermission(): Promise<boolean>;
  abstract notify(alerts: RenewalAlert[]): void;
}
