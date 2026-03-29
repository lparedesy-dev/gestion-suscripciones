import { Component } from '@angular/core';

@Component({
  selector: 'app-glass-card',
  template: `
    <div class="card-glass">
      <ng-content />
    </div>
  `,
})
export class GlassCardComponent {}
