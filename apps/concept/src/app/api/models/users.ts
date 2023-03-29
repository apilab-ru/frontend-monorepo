import { CurrentUser } from "../../users/models/interface";

export interface ApiUser extends CurrentUser {
  password: string;
  teamId: string;
}

export const DEFAULT_USERS: ApiUser[] = [
  {
    id: '1d120705-a947-4e1d-9fa0-aec1ad68ec88',
    teamId: '4060e01a-7835-49bf-aaab-ddb9c2de20fb',
    token: '',
    name: 'Admin',
    email: 'admin@admin.ru',
    password: '123',
    photo: '//placekitten.com/g/200/200'
  },
  {
    id: '09dee9e2-a058-47b6-a555-d09767f25943',
    token: '',
    teamId: '0d583888-2854-40c8-b727-7e9c6f3d28eb',
    name: 'Second',
    email: 'second@second.ru',
    password: '123',
    photo: '//placekitten.com/g/200/200'
  },
];