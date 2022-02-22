import { AgentDto } from './agent.dto';
import { ExchangeType } from "./exchange.dto";

export enum AgentModeType {
  INTERVAL = 'interval',
  TIMEOUT = 'timeout',
  CRON = 'cron'
}

export enum AgentType {
  GRID = 'grid',
  ENDPOINT = 'endpoint',
  SCRIPT = 'script'
}

export type AgentMode = {
  type: AgentModeType,
  value: string
}

export type AgentGridConfig = {
  pair: string,
  minPrice: number,
  gridWidth: number,
  gridCount: number
}

export type AgentEndpointConfig = {
  endpoint: string;
}

export type AgentScriptConfig = {
  script: string;
}

export type AgentConfig = AgentGridConfig | AgentEndpointConfig | AgentScriptConfig;

export interface AgentConfigurationDto {
  id: string;
  exchangeType: ExchangeType;
  mode: AgentMode;
  type: AgentType;
  config: AgentConfig;
  version: number;
  createdAt: Date;
  agent: Partial<AgentDto>;
}
