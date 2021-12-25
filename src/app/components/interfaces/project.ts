import { ProjectType } from '../../portfolio/portfolio';

export interface Project {
  id: string;
  img: string;
  titleShort: string;
  date: string;
  types: ProjectType[];
  title: string;
  stack: string;
  link?: {
    name?: string,
    href: string,
    github?: string,
  },
  link2?: {
    name?: string,
    href: string,
  },
  details: {
    text?: string;
    image?: string;
  }[];
}
