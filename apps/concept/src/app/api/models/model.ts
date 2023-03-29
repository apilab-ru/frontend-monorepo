import { DbConfig } from "@store/lib/interface";
import { Task } from "../../board/models/tasks";
import { Mark } from "../../board/models/marks";
import { Time } from "../../times/models/interface";
import { ApiUser, DEFAULT_USERS } from "./users";
import { ApiTeam, DEFAULT_TEAMS } from "./teams";

export const DB_CONFIG: DbConfig = {
  name: 'taskManager',
  version: 1,
  objects: [
    {
      name: 'users',
      options: { keyPath: ['id', 'email'] },
      values: DEFAULT_USERS,
    },
    {
      name: 'teams',
      options: { keyPath: 'id' },
      values: DEFAULT_TEAMS,
    },
    {
      name: 'tasks',
      options: { keyPath: 'id' },
    },
    {
      name: 'tags',
      options: { keyPath: 'id' },
    },
    {
      name: 'marks',
      options: { keyPath: 'id' },
    },
    {
      name: 'times',
      options: { keyPath: 'id' },
    }
  ],
}

export interface LocalDbTaskManager {
  users: ApiUser;
  teams: ApiTeam;
  tasks: Task;
  marks: Mark;
  times: Time;
}