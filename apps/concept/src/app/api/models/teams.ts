import { Team } from "../../team/models/interface";

export interface ApiTeam extends Team {
  id: string;
}

export const DEFAULT_TEAMS: ApiTeam[] = [
  {
    id: '4060e01a-7835-49bf-aaab-ddb9c2de20fb',
    name: 'FirstCompany'
  },
  {
    id: '0d583888-2854-40c8-b727-7e9c6f3d28eb',
    name: 'SecondCompany'
  }
];