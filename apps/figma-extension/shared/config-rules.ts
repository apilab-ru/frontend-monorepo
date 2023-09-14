export type ConfigRules = Record<string, ConfigRule>;

export interface ConfigRule {
  map: Record<string, string>;
  template: string;
}

export const RULE_VALUE_PLACEHOLDER = '{{data}}';