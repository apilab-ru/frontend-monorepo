import { ProviderAbstract } from "./services/povider-abstract";
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
        title: 'Api Key',
        help: `Make api key <a href="https://app.clockify.me/user/settings" target="_blank">on page</a>`
      }
    ]
  },

  [IntegrationType.jira]: {
    provider: ProviderJira,
    message: `Right now integration work without api. App generate javascript code. You can copy code and paste on jira suite console abd run. `,
    fields: [
      {
        field: 'domain',
        title: 'Domain',
        help: `For example dev.jira.com`
      }
    ]
  }
}