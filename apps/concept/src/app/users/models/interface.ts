export interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
}

export interface CurrentUser extends User {
  token: string;
  password?: string;
}
