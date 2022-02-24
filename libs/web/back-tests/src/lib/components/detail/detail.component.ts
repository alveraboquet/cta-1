import { BehaviorSubject } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackTestDto } from '@cta/shared/dtos';
import { BackTestsService } from '../../back-tests.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AgentsService } from '@cta/web/agents';
import {NzSelectOptionInterface} from "ng-zorro-antd/select/select.types";

@Component({
  selector: 'cta-web-agents-list',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DetailComponent implements OnInit, OnDestroy {
  submitting$ = new BehaviorSubject<boolean>(false);
  agentsOptionsLimit = 10;
  agentsOptionsPage = 1;
  agentsOptionsSortBy = '';
  agentsOptions$ = new BehaviorSubject<NzSelectOptionInterface[]> ([]);
  backTest = {
    name: 'Untitled Back Test',
    configuration: {
      agents: []
    },
  } as Partial<BackTestDto>;
  agentsFormControl = new FormControl(this.backTest.configuration?.agents, Validators.required);
  configFormGroup = new FormGroup({
    agents: this.agentsFormControl,
  });

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly agentsService: AgentsService,
    private readonly backTestsService: BackTestsService,
    private readonly messageService: NzMessageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.backTest.id = this.route.snapshot.paramMap.get('id') || undefined;
    this.agentsFormControl.disable({ emitEvent: false });
    await this.updateAgentOptions();
    this.agentsFormControl.enable({ emitEvent: false });
    await this.updateData();
  }

  ngOnDestroy() {}

  async updateAgentOptions() {
    const agentsOptions = this.agentsOptions$.getValue();

    if (agentsOptions.length < this.agentsOptionsPage * this.agentsOptionsLimit) {
      try {
        const agentsList = await this.agentsService.get(
          this.agentsOptionsLimit,
          this.agentsOptionsPage,
          this.agentsOptionsSortBy
        );

        this.agentsOptions$.next(
          [
            ...agentsOptions,
            ...agentsList.data.map((agent) => ({
              value: agent.id,
              label: agent.name,
            }))
          ]
        );
      } catch (e) {
        this.messageService.error(
          'An error occurred while loading agents data... Please try again at a later time.'
        );
      }
    }
  }

  async updateData(): Promise<void> {
    if (this.backTest.id) {
      try {
        this.configFormGroup.disable({ emitEvent: false });
        this.backTest = await this.backTestsService.findOne(this.backTest.id);
      } catch (e) {
        this.messageService.error(
          'An error occurred while loading back test data... Please try again at a later time.'
        );
      } finally {
        this.configFormGroup.enable({ emitEvent: false });
      }

      if (this.backTest.configuration) {
        this.configFormGroup.setValue({
          agents: this.backTest.configuration.agents?.map((agent) => agent.id),
        });
      }
    }
  }

  handleConfigFormChange() {
    const agents = (this.agentsFormControl.value as string[]).map((id) => ({id}));
    this.backTest.configuration = {
      ...this.backTest.configuration,
      agents
    };
  }

  async handleSubmit() {
    try {
      this.submitting$.next(true);
      this.backTest = await this.backTestsService.update(this.backTest);
      this.messageService.success('Back test created successfully!');
      await this.router.navigate(['back-tests']);
    } catch (e) {
      this.messageService.error(
        'An error occurred while saving the back test... Please try again at a later time.'
      );
    } finally {
      this.submitting$.next(false);
    }
  }
}
