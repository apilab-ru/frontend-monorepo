import { Genre } from '@filecab/models/genre';
import { LibraryItemV2 } from "@filecab/models/library";

export const STORE_DATA = {
  data: [] as LibraryItemV2[],
  lastTimeUpdate: 0,
  genres: [] as Genre[],
};
