import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Subscription } from '../../../core/domain/entities/subscription.entity';

type TagSeverity = 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined;

@Component({
  selector: 'app-subscription-card',
  imports: [RouterLink, DecimalPipe, ButtonModule, TagModule],
  templateUrl: './subscription-card.component.html',
})
export class SubscriptionCardComponent {
  readonly subscription = input.required<Subscription>();
  readonly deleted = output<string>();

  get statusLabel(): string {
    const map: Record<string, string> = { active: 'Activa', paused: 'Pausada', cancelled: 'Cancelada' };
    return map[this.subscription().status] ?? '';
  }

  get statusSeverity(): TagSeverity {
    const map: Record<string, TagSeverity> = {
      active: 'success',
      paused: 'warn',
      cancelled: 'danger',
    };
    return map[this.subscription().status];
  }

  get cycleLabel(): string {
    return this.subscription().billingCycle === 'monthly' ? 'mes' : 'año';
  }

  get renewalLabel(): string {
    const sub = this.subscription();
    if (sub.billingCycle === 'monthly') {
      return `Día ${sub.renewalDay} de cada mes`;
    }
    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const monthName = monthNames[(sub.renewalMonth ?? 1) - 1];
    return `${sub.renewalDay} de ${monthName}`;
  }

  confirmDelete(): void {
    if (confirm(`¿Eliminar ${this.subscription().name}?`)) {
      this.deleted.emit(this.subscription().id);
    }
  }
}
