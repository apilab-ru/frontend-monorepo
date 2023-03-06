import { ProjectType } from '../../portfolio/portfolio';

export interface ProjectLink {
  name?: string,
  icon?: 'github';
  href: string;
}

export interface Project {
  id: string;
  img: string;
  titleShort: string;
  date: string;
  types: ProjectType[];
  title: string;
  stack: string;
  links: ProjectLink[];
  details: {
    text?: string;
    image?: string;
  }[];
}
