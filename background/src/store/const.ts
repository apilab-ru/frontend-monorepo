import { Tag } from '@shared/models/tag';
import { parserSchemas } from '@shared/parser/const';
import { TYPES } from '@shared/models/const';
import { LibraryItem } from '@server/models';
import { Genre } from '@server/models/genre';
import { LibrarySettings } from '@shared/models/library';

type Optional<T> = T | undefined;

const configDefault = {
  schemas: parserSchemas,
  types: TYPES,
};

export const STORE_DATA = {
  tags: [] as Tag[],
  data: {} as Record<string, LibraryItem[]>,
  lastTimeUpdate: 0,
  config: configDefault,
  genres: [] as Genre[],
  settings: undefined as Optional<LibrarySettings>,
};
