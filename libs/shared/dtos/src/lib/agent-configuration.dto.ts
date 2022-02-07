import { AgentDto } from './agent.dto';

export enum AgentModeType {
  CRON = 'cron',
  INTERVAL = 'interval',
  TIMEOUT = 'timeout'
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
  mode: AgentMode;
  type: AgentType;
  config: AgentConfig;
  version: number;
  createdAt: Date;
  agent: AgentDto;
}
