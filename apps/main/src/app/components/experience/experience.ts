import { Work } from '../interfaces/work';

export const START_WORK_DATE = '2013-12-01';

interface JobItem extends Pick<Work, 'dateFrom' | 'dateTo'> {
  key: string;
}

export const JOB_LIST: JobItem[] = [
  {
    key: 'skyeng',
    dateFrom: '2019-10-01',
    dateTo: null,
  },
  {
    key: 'simbirSoft',
    dateFrom: '2019-08-01',
    dateTo: '2019-09-30',
  },
  {
    key: 'haulmont',
    dateFrom: '2018-02-01',
    dateTo: '2019-07-31',
  },
  {
    key: 'intrum',
    dateFrom: "2015-08-01",
    dateTo: "2018-02-28",
  },
  {
    key: 'parusMedia',
    dateFrom: "2013-12-01",
    dateTo: "2015-08-31",
  }
];
