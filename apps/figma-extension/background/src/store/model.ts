import { ConfigRules } from "../../../shared/config-rules";

export interface IConfig {
  enabled: boolean,
  reloadEnable: boolean,
  rules: ConfigRules | null,
  test: string
}