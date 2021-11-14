import { ProjectType } from '../../portfolio';

export interface Project {
  id: string;
  img: string;
  title: string;
  date: string;
  types: ProjectType[];
}

export interface ProjectDetails {
  title: string;
  stack: string;
  date: string;
  link?: {
    name?: string,
    href: string,
    github?: string,
  },
  details: {
    text?: string;
    image?: string;
  }[];
}
