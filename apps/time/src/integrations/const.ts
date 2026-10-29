import { ProviderAbstract } from "./services/provider-abstract";
import { ProviderClockify } from "./services/provider-clockify";
import { Type } from '@angular/core';
import { ProviderJira } from "./services/provider-jira";

export enum IntegrationType {
  jira = 'jira',
  clockify = 'clockify',
}

export type IntegrationHelp = string | ((form: object) => string);

export interface IntegrationConfigField {
  field: string;
  title: string;
  help: IntegrationHelp;
}

export type IntegrationConfig = {
  provider: Type<ProviderAbstract>;
  message?: string;
  fields: IntegrationConfigField[];
};

export const INTEGRATION_MAP_CONFIG: Record<IntegrationType, IntegrationConfig> = {
  [IntegrationType.clockify]: {
    provider: ProviderClockify,
    fields: [
      {
        field: 'apiKey',
        title: 'API key',
        help: `Create an API key <a href="https://app.clockify.me/user/settings" target="_blank">on the settings page</a>.`
      }
    ]
  },

  [IntegrationType.jira]: {
    provider: ProviderJira,
    message: `This integration currently works without the API. The app generates JavaScript code. Copy the code, paste it into the browser console on the Jira site, and run it.`,
    fields: [
      {
        field: 'domain',
        title: 'Domain',
        help: `For example, dev.jira.com`
      }
    ]
  }
}