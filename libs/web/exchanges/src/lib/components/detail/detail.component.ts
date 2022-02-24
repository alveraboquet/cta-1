import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExchangeDto, ExchangeType } from '@cta/shared/dtos';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExchangesService } from '../../exchanges.service';

@Component({
  selector: 'cta-web-agents-list',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DetailComponent implements OnInit, OnDestroy {
  submitting$ = new BehaviorSubject<boolean>(false);
  exchangeTypeOptions = Object.values(ExchangeType).map((value) => ({
    value,
    label: value,
  }));
  exchange = {
    type: ExchangeType.BINANCE,
  } as Partial<ExchangeDto>;
  configTypeFormControl = new FormControl(
    this.exchange.type,
    Validators.required
  );
  rawConfigFormGroup = new FormGroup({});
  configFormGroup = new FormGroup({
    type: this.configTypeFormControl,
    config: this.rawConfigFormGroup,
  });
  configBinanceFormGroup = new FormGroup({
    apiKey: new FormControl('', Validators.required),
    secretKey: new FormControl('', Validators.required),
  });
  configCoinbaseFormGroup = new FormGroup({
    apiKey: new FormControl('', Validators.required),
    secretKey: new FormControl('', Validators.required),
  });
  private configFormChangeSub?: Subscription;
  private typeChangeSub?: Subscription;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly messageService: NzMessageService,
    private readonly exchangesService: ExchangesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.exchange.id = this.route.snapshot.paramMap.get('id') || undefined;
    this.handleTypeChange();
    this.typeChangeSub = this.configTypeFormControl.valueChanges.subscribe(
      this.handleTypeChange.bind(this)
    );
    this.configFormChangeSub = this.configFormGroup.valueChanges.subscribe(
      this.handleConfigFormChange.bind(this)
    );
    await this.updateData();
  }

  ngOnDestroy() {
    this.typeChangeSub?.unsubscribe();
  }

  async updateData(): Promise<void> {
    if (this.exchange.id) {
      try {
        this.configFormGroup.disable({ emitEvent: false });
        this.exchange = await this.exchangesService.findOne(this.exchange.id);
      } catch (e) {
        this.messageService.error(
          'An error occurred while loading agent data... Please try again at a later time.'
        );
      } finally {
        this.configFormGroup.enable({ emitEvent: false });
      }
      this.configFormGroup.setValue({
        type: this.exchange.type,
        config: this.exchange.config,
      });
    }
  }

  handleConfigFormChange() {
    this.exchange = {
      ...this.exchange,
      ...this.configFormGroup.getRawValue(),
    };
  }

  handleTypeChange() {
    switch (this.configTypeFormControl.value) {
      case ExchangeType.BINANCE:
        this.rawConfigFormGroup = this.configBinanceFormGroup;
        break;
      case ExchangeType.COINBASE:
        this.rawConfigFormGroup = this.configCoinbaseFormGroup;
        break;
      default:
        this.rawConfigFormGroup = new FormGroup({});
        break;
    }
    this.configFormGroup.setControl('config', this.rawConfigFormGroup);
  }

  async handleSubmit() {
    try {
      this.submitting$.next(true);
      this.exchange = await this.exchangesService.update(this.exchange);
      this.messageService.success('Exchange created successfully!');
      await this.router.navigate(['']);
    } catch (e) {
      this.messageService.error(
        'An error occurred while saving the agent... Please try again at a later time.'
      );
    } finally {
      this.submitting$.next(false);
    }
  }
}
