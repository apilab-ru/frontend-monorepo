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

const jiraLink = (domain: string) => `https://${ domain }/secure/ViewProfile.jspa?selectedTab=com.atlassian.pats.pats-plugin:jira-user-personal-access-tokens`
const corsLink = 'https://alfilatov.com/posts/run-chrome-without-cors/';

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
    message: `For work integration please allow cors in browser, for <a href="${ corsLink }" target="_blank">example</a>`,
    fields: [
      {
        field: 'domain',
        title: 'Domain',
        help: `For example dev.jira.com`
      },
      {
        field: 'token',
        title: 'Token',
        help: ({ domain }: { domain: string }) => `Make token on <a
            target="_blank"
            href='${ jiraLink(domain || 'dev.jira.com') }'>page</a>`
      },
    ]
  }
}