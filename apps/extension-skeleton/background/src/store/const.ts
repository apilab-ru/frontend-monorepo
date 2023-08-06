import { GithubRepo } from "@shared/github";
import { User } from "@shared/user/interface";

type Optional<T> = T | undefined;

export interface StoreTest {
  counter: number;
}

export const STORE_DATA = {
  user: undefined as Optional<User>,
  test: {
    counter: 0
  },
  repos: undefined as Optional<GithubRepo[]>,
}
