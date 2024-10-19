import { ConfigRules, RULE_VALUE_PLACEHOLDER } from "../../shared/config-rules";

export class ParserTokens {
  parse(rules: ConfigRules, token: string): string | null {
    let value: string | undefined;

    const rule = rules.find(rule => {
      value = rule.map[token];
      if (!value) {
        value = Object.entries(rule.map)
          .map(([key, value]) => ({ key, value }))
          .find(({ key }) => token.includes(key))?.value;
      }

      return value;
    })

    if (rule) {
      console.info('original token', token);
      return rule.template.replace(RULE_VALUE_PLACEHOLDER, value);
    }

    console.info('not found token: ' + token);

    return null;
  }
}