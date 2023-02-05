import { TimesAction } from './times';
import { SharedAction } from './history';

export * from './times';
export * from './history';

export type Action = TimesAction | SharedAction;
