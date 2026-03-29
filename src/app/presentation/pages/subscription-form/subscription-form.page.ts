import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SubscriptionService } from '../../../core/application/services/subscription.service';
import { NotificationService } from '../../../core/application/services/notification.service';

const CARD_TYPES = [
  'Visa', 'Mastercard', 'American Express', 'Débito',
  'Mercado Pago', 'PayPal', 'Transferencia', 'Efectivo', 'Otro',
];

const CURRENCIES = [
  { label: 'ARS — Peso argentino', value: 'ARS' },
  { label: 'BRL — Real brasileño', value: 'BRL' },
  { label: 'CLP — Peso chileno', value: 'CLP' },
  { label: 'COP — Peso colombiano', value: 'COP' },
  { label: 'EUR — Euro', value: 'EUR' },
  { label: 'GBP — Libra esterlina', value: 'GBP' },
  { label: 'MXN — Peso mexicano', value: 'MXN' },
  { label: 'USD — Dólar estadounidense', value: 'USD' },
  { label: 'UYU — Peso uruguayo', value: 'UYU' },
];

const POPULAR_SERVICES: { name: string; color: string }[] = [
  { name: 'Netflix', color: '#e50914' },
  { name: 'Max', color: '#002be7' },
  { name: 'Prime Video', color: '#00a8e0' },
  { name: 'Disney+', color: '#0d2481' },
  { name: 'Spotify', color: '#1db954' },
  { name: 'YouTube Premium', color: '#ff0000' },
  { name: 'Apple TV+', color: '#555555' },
  { name: 'Paramount+', color: '#0064ff' },
];

@Component({
  selector: 'app-subscription-form-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    PasswordModule,
    SelectModule,
    ToggleSwitchModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './subscription-form.page.html',
})
export class SubscriptionFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly subService = inject(SubscriptionService);
  readonly notifService = inject(NotificationService);

  readonly editId = signal<string | null>(null);
  readonly isEdit = signal(false);
  readonly isMonthly = signal(true);
  readonly popularServices = POPULAR_SERVICES;

  readonly currencyOptions = CURRENCIES;
  readonly cardTypeOptions = CARD_TYPES;

  readonly cycleOptions = [
    { label: 'Mensual', value: 'monthly' },
    { label: 'Anual', value: 'annual' },
  ];

  readonly statusOptions = [
    { label: 'Activa', value: 'active' },
    { label: 'Pausada', value: 'paused' },
    { label: 'Cancelada', value: 'cancelled' },
  ];

  readonly months = [
    { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' }, { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
  ];

  readonly days = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: i + 1 }));

  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    cost: [0, [Validators.required, Validators.min(0)]],
    currency: ['USD', Validators.required],
    billingCycle: ['monthly' as 'monthly' | 'annual', Validators.required],
    renewalDay: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
    renewalMonth: [null as number | null],
    cardType: ['Visa', Validators.required],
    cardLastFour: ['', [Validators.maxLength(4), Validators.pattern(/^\d{0,4}$/)]],
    status: ['active' as 'active' | 'paused' | 'cancelled', Validators.required],
    color: ['#4f46e5'],
    logoUrl: [''],
    notificationsEnabled: [true],
    daysBeforeRenewal: [7, [Validators.required, Validators.min(1), Validators.max(90)]],
  });

  ngOnInit(): void {
    this.subService.load();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(id);
      this.isEdit.set(true);
      const sub = this.subService.getById(id);
      if (sub) {
        this.isMonthly.set(sub.billingCycle === 'monthly');
        const pmParts = (sub.paymentMethod ?? '').split(' ••');
        this.form.patchValue({
          name: sub.name,
          email: sub.email,
          password: sub.password ?? '',
          cost: sub.cost,
          currency: sub.currency ?? 'USD',
          billingCycle: sub.billingCycle,
          renewalDay: sub.renewalDay,
          renewalMonth: sub.renewalMonth ?? null,
          cardType: pmParts[0] || 'Visa',
          cardLastFour: pmParts[1] ?? '',
          status: sub.status,
          color: sub.color ?? '#4f46e5',
          logoUrl: sub.logoUrl ?? '',
          notificationsEnabled: sub.notifications.enabled,
          daysBeforeRenewal: sub.notifications.daysBeforeRenewal,
        });
      }
    }
  }

  selectPopular(service: { name: string; color: string }): void {
    this.form.patchValue({ name: service.name, color: service.color });
  }

  onCycleChange(value: string | null): void {
    this.isMonthly.set(value === 'monthly');
    this.form.patchValue({ renewalDay: 1, renewalMonth: null });
  }

  async submit(): Promise<void> {
    const v = this.form.getRawValue();

    if (v.billingCycle === 'annual' && !v.renewalMonth) {
      this.form.controls.renewalMonth.setErrors({ required: true });
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const lastFour = v.cardLastFour?.trim();
    const paymentMethod = lastFour ? `${v.cardType} ••${lastFour}` : v.cardType!;

    const dto = {
      name: v.name!,
      email: v.email!,
      password: v.password || undefined,
      cost: Number(v.cost),
      currency: v.currency ?? 'USD',
      billingCycle: v.billingCycle!,
      renewalDay: Number(v.renewalDay),
      renewalMonth: v.billingCycle === 'annual' ? Number(v.renewalMonth) : undefined,
      paymentMethod,
      status: v.status!,
      color: v.color ?? '#4f46e5',
      logoUrl: v.logoUrl || undefined,
      notifications: {
        enabled: !!v.notificationsEnabled,
        daysBeforeRenewal: Number(v.daysBeforeRenewal),
      },
    };

    if (this.isEdit()) {
      this.subService.update(this.editId()!, dto);
    } else {
      this.subService.create(dto);
      if (v.notificationsEnabled) {
        await this.notifService.requestPermission();
      }
    }

    this.router.navigate(['/']);
  }
}
