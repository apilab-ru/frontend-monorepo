export enum IntegrationType {
  clockify = 'clockify',
}

export interface Integration {
  type: IntegrationType;
  apiKey: string;
}

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
