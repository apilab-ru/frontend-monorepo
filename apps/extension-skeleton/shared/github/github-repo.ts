export interface GithubRepo {
  archived: boolean;
  created_at: string;
  forks_count: number;
  id: number;
  language: string;
  name: string;
  url: string;
}

export interface GitUser {
  "login": string,
  "id": number,
  "avatar_url": string,
  "html_url": string,
  "name": string,
  "company": string,
  "blog": string,
  "location": string,
  "email": null,
  "hireable": true,
  "bio": null,
  "public_repos": number,
  "public_gists": number,
  "followers": number,
  "following": number,
  "created_at": string,
  "updated_at": string
}
