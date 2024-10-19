import { ConfigRule, ConfigRules } from "@shared/config-rules";
import { IConfig } from "../store/model";

export class ConfigApi {
  loadConfig(defaultConfig: IConfig): Promise<IConfig> {
    return this.loadRulesJson().then(rules => {
      if (!rules) {
        return defaultConfig;
      }

      return {
        ...defaultConfig,
        rules
      }
    })
  }

  loadRulesJson(): Promise<ConfigRules | null> {
    return fetch('./rules.json')
      .then(res => res.json())
      .then(res => this.parserRules(res))
      .catch(() => null)
  }

  private parserRules(response: Record<string, ConfigRule>): ConfigRules {
    const rules = Object.values(response);

    const replaceTokenPart = ' [day]';

    rules.forEach(rule => {
      const tokens = Object.entries(rule.map);
      tokens.forEach(([key, value]) => {
        if (key.includes(replaceTokenPart)) {
          rule.map[key.replace(replaceTokenPart, '')] = value;
        }
      })
    })

    return rules;
  }
}