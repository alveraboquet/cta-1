import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AgentConfigurationDto, AgentDto, AgentModeType, AgentType, ExchangeType} from '@cta/shared/dtos';
import { AgentsService } from '../../agents.service';
import { AgentConfigurationsService } from "../../agent-configurations.service";

@Component({
  selector: 'cta-web-agents-list',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class EditComponent implements OnInit, OnDestroy {
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
  agentConfiguration = {} as Partial<AgentConfigurationDto>;
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
    private readonly agentConfigurationsService: AgentConfigurationsService
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
      this.agentConfiguration = await this.agentConfigurationsService.get(this.agent.id);
      this.configFormGroup.setValue({
        exchangeType: this.agentConfiguration.exchangeType,
        mode: this.agentConfiguration.mode,
        type: this.agentConfiguration.type,
        config: this.agentConfiguration.config,
      });
    }
  }

  handleConfigFormChange() {
    this.agentConfiguration = {
      ...this.agentConfiguration,
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
    this.submitting$.next(true);
    try {
      this.agent = await this.agentsService.update(this.agent);
      if (this.agent.id) {
        this.agentConfiguration = await this.agentConfigurationsService.update(this.agent.id, this.agentConfiguration);
      }
      await this.router.navigate(['']);
    } finally {
      console.log('Saved agent: ', this.agent);
      console.log('Saved configuration: ', this.agentConfiguration);
      this.submitting$.next(false);
    }
  }
}
