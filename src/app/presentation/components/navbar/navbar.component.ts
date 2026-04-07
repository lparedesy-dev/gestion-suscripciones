import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ThemePort } from '../../../core/application/ports/theme.port';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ButtonModule, TooltipModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  readonly themePort = inject(ThemePort);
}
