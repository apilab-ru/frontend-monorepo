import { from, Observable } from "rxjs";
import { GithubRepo, GitUser } from "./github-repo";
import { map } from "rxjs/operators";

export class GithubApi {

  fetchRepos(user: string): Observable<GithubRepo[]> {
    const url = `https://api.github.com/users/${ user }/repos?per_page=100`;
    return from(fetch(url).then(res => res.json())).pipe(
      map(list => list.map((item: GithubRepo) => ({
        archived: item.archived,
        created_at: item.created_at,
        forks_count: item.forks_count,
        id: item.id,
        language: item.language,
        name: item.name,
        url: item.url,
      })))
    );
  }

  fetchUser(user: string): Observable<GitUser> {
    const url = `https://api.github.com/users/${ user }`;
    return from(fetch(url).then(res => res.json()));
  }
}

export const githubApi = new GithubApi();
