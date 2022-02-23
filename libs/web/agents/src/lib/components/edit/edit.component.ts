import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentDto, AgentModeType, AgentType, ExchangeType } from '@cta/shared/dtos';
import { AgentsService } from '../../agents.service';
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: 'cta-web-agents-list',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class EditComponent implements OnInit, OnDestroy {
  loading$ = new BehaviorSubject<boolean>(false);
  submitting$ = new BehaviorSubject<boolean>(false);
  exchangeTypeOptions = Object.values(ExchangeType).map((value) => ({
    value,
    label: value,
  }));
  modeTypeOptions = Object.values(AgentModeType).map((value) => ({
    value,
    label: value,
  }));
  typeOptions = Object.values(AgentType).map((value) => ({
    value,
    label: value,
  }));
  agent = {
    name: 'Untitled Agent',
  } as Partial<AgentDto>;
  agentTypes = AgentType;
  modeFormGroup = new FormGroup({
    type: new FormControl(AgentModeType.INTERVAL, Validators.required),
    value: new FormControl('', Validators.required),
  });
  configTypeFormControl = new FormControl(AgentType.GRID, Validators.required);
  rawConfigFormGroup = new FormGroup({});
  configFormGroup = new FormGroup({
    exchangeType: new FormControl(ExchangeType.BINANCE, Validators.required),
    mode: this.modeFormGroup,
    type: this.configTypeFormControl,
    config: this.rawConfigFormGroup,
  });
  configGridFormGroup = new FormGroup({
    pair: new FormControl('', Validators.required),
    minPrice: new FormControl('', Validators.required),
    gridWidth: new FormControl('', Validators.required),
    gridCount: new FormControl('', Validators.required),
  });
  configEndpointFormGroup = new FormGroup({
    endpoint: new FormControl('', Validators.required),
  });
  configScriptFormGroup = new FormGroup({
    script: new FormControl('', Validators.required),
  });
  private configFormChangeSub?: Subscription;
  private typeChangeSub?: Subscription;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly agentsService: AgentsService,
    private readonly messageService: NzMessageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.agent.id = this.route.snapshot.paramMap.get('id') || undefined;
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
    if (this.agent.id) {
      try {
        this.loading$.next(true);
        this.agent = await this.agentsService.findOne(this.agent.id);
      } catch (e) {
        this.messageService.error('An error occurred while loading agent data... Please try again at a later time.');
      } finally {
        this.loading$.next(false);
      }

      if (this.agent.configuration) {
        this.configFormGroup.setValue({
          exchangeType: this.agent.configuration.exchangeType,
          mode: this.agent.configuration.mode,
          type: this.agent.configuration.type,
          config: this.agent.configuration.config,
        });
      }
    }
  }

  handleConfigFormChange() {
    this.agent.configuration = {
      ...this.agent.configuration,
      ...this.configFormGroup.getRawValue()
    }
  }

  handleTypeChange() {
    switch (this.configTypeFormControl.value) {
      case AgentType.GRID:
        this.rawConfigFormGroup = this.configGridFormGroup;
        break;
      case AgentType.ENDPOINT:
        this.rawConfigFormGroup = this.configEndpointFormGroup;
        break;
      case AgentType.SCRIPT:
        this.rawConfigFormGroup = this.configScriptFormGroup;
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
      this.agent = await this.agentsService.update(this.agent);
      this.messageService.success('Agent created successfully!');
      await this.router.navigate(['']);
    } catch (e) {
      this.messageService.error('An error occurred while saving the agent... Please try again at a later time.');
    } finally {
      this.submitting$.next(false);
    }
  }
}
