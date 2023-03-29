import { IDbStoreService } from "@store/lib/index-db-store";
import { Injectable } from "@angular/core";
import { DB_CONFIG, LocalDbTaskManager } from "../models/model";
import { ApiUser } from "../models/users";

@Injectable()
export class LocalDbStoreService extends IDbStoreService<LocalDbTaskManager> {
  private user: ApiUser | null;

  constructor() {
    super(DB_CONFIG);
  }

  getUser(): ApiUser | null {
    return this.user;
  }

  setUser(user: ApiUser | null): void {
    this.user = user;
  }

  genUuid(): string {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
}