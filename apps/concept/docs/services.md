# Сервисы

## API сервисы
Содержат запросы к апи, и мапинг

```
//users-api.ts

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private endpoint = '/user/';

  constructor(
    private httpClient: HttpClient,
  ) { }

  auth(email: string, password: string): Observable<CurrentUser> {
    return this.httpClient.post<CurrentUser>(this.endpoint + 'auth', {
      email,
      password
    });
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(this.endpoint + 'logout', {}, {
      withCredentials: true,
    });
  }
}
```

## Entity сервисы
Содержат работу с конкретной сущностью из фичи, могут содержать стор с кешем этой сущности
Работу с апи ведут строго через апи сервисы

```
@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$: Observable<CurrentUser | null>;
  token$: Observable<string | null>;

  private user = new BehaviorSubject<CurrentUser | null | undefined>(undefined);

  constructor(
    private userApiService: UserApiService,
    private storageService: LocalStorageService,
  ) {
    this.user$ = this.loadUser().pipe(
      tap(user => this.user.next(user)),
      switchMap(() => this.user.asObservable()),
      filterUndefined(),
      shareReplay({ refCount: false, bufferSize: 1 }),
    )

    this.token$ = this.user$.pipe(
      map(user => user?.token || null)
    );
  }

  auth(email: string, password: string): Observable<CurrentUser> {
    return this.userApiService.auth(email, password).pipe(
      tap()
    );
  }

  logout(): Observable<void> {
    return this.userApiService.logout();
  }

  update(user: User): Observable<User> {
    return this.userApiService.update(user).pipe(
      tap(user => {
        const { token } = this.user.value!;
        this.setUser({
          ...user,
          token
        })
      })
    );
  }

  private loadUser(): Observable<CurrentUser | null> {
    const user = this.storageService.getData(storageKey, null);
    return of(user);
  }

  private setUser(user: CurrentUser): void {
    this.user.next(user);
    this.storageService.setData(storageKey, user);
  }
}
```

## Фича сервисы
Cодержат работу с конкретной фичей. Более масштабные чем Entity сервисы, и не хранят состояния Entity

```
@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private store = makeStore({
    refreshSign: undefined as void,
    loading: false,
  });
  
  loading$ = this.store.loading.asObservable();
  
  constructor(
    private taskApiService: TaskApiService,
  ) {
  }

  loadList(query: TasksQuery): Observable<Response<Task>> {
    return this.store.refreshSign.pipe(
      tap(() => this.store.loading.next(true)),
      switchMap(() => this.taskApiService.loadList(query)),
      tap(() => this.store.loading.next(false)),
    );
  }

  createTask(task: TaskDetailRequest): Observable<TaskDetail> {
    return this.taskApiService.createTask(task).pipe(
      tap(() => this.store.refreshSign.next())
    );
  }
}
```