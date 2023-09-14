import { ConfigRules, RULE_VALUE_PLACEHOLDER } from "@shared/config-rules";

export class ParserTokens {
  parse(rules: ConfigRules, token: string): string | null {
    console.log('xxx token', token);

    const list = Object.values(rules);

    let value: string | undefined;

    const rule = list.find(rule => {
      value = rule.map[token];
      if (!value) {
        value = Object.entries(rule.map)
          .map(([key, value]) => ({ key, value }))
          .find(({ key }) => token.includes(key))?.value;
      }

      return value;
    })

    if (rule) {
      return rule.template.replace(RULE_VALUE_PLACEHOLDER, value);
    }

    return null;
  }
}