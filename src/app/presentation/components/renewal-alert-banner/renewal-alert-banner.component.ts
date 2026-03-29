import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { RenewalAlert } from '../../../core/domain/entities/subscription.entity';

@Component({
  selector: 'app-renewal-alert-banner',
  imports: [TagModule],
  templateUrl: './renewal-alert-banner.component.html',
})
export class RenewalAlertBannerComponent {
  readonly alerts = input.required<RenewalAlert[]>();
}
