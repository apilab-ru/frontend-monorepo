import { ProjectType } from '../portfolio/const';

export interface Project {
  id: number;
  img: string;
  title: string;
  date: string;
  types: ProjectType[];
}
