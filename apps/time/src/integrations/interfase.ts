import { IntegrationType } from "./const";

interface IntegrationBase {
  type: IntegrationType;
}

export interface IntegrationClockify extends IntegrationBase {
  type: IntegrationType.clockify;
  apiKey: string;
}

export interface IntegrationJira extends IntegrationBase {
  type: IntegrationType.jira;
  token: string;
  domain: string;
}

export type Integration = IntegrationClockify | IntegrationJira;

export interface ClockifyItem {
  start: string; // 2018-06-12T13:48:14.000Z
  billable: "false";
  description: string;
  projectId: string;
  taskId: string;
  end: string;
  tagIds: string[],
  customFields: {
    customFieldId : string,
    value: string
  }[]
}

export interface JiraItem {
  comment: string;
  started: string, // 2021-01-17T12:34:00.000+0000
  timeSpentSeconds: number,
}
