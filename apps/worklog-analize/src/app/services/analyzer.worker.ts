/// <reference lib="webworker" />

import { Observable, debounceTime, switchMap } from "rxjs";
import { GroupConfig, Log, LogDetail, Rule } from "../interfaces";
import _chunk from 'lodash-es/chunk';

const CHUNK_SIZE = 500;

interface Event {
  list: Log[];
  rules: Rule[];
  groupConfig: GroupConfig;
}

const messages$ = new Observable<Event>(subject => {
  addEventListener('message', ({ data }) => {
    subject.next(data);
  });
})

messages$.pipe(
  debounceTime(10),
  switchMap(({ list, rules, groupConfig }) => groupLogsByChunks(list, rules, groupConfig))
).subscribe(response => {
  postMessage(response)
})

function groupLogsByChunks(list: Log[], rules: Rule[], groupConfig: GroupConfig): Observable<LogDetail[]> {
  return new Observable<LogDetail[]>(subject => {

    const chunks = _chunk(list, CHUNK_SIZE);
    let mapLogs: Record<string, LogDetail> = {};
    let canProcess = true;
    let timer: number;

    const iterator = () => {
      if (!canProcess) {
        return;
      }

      const items = chunks.shift();
      mapLogs = groupLogs(mapLogs, items!, rules, groupConfig);

      if (chunks.length) {
        timer = setTimeout(() => iterator()) as unknown as number;
      } else {
        const result = Object.values(mapLogs) as LogDetail[];
        result.sort((a, b) => b.time - a.time)
        subject.next(result);
      }
    }

    iterator();

    return () => {
      canProcess = false;
      clearTimeout(timer);
    }
  })
}

function groupLogs(mapLogs: Record<string, LogDetail>, list: Log[], rules: Rule[], groupConfig: GroupConfig): Record<string, LogDetail> {
  list.forEach((item) => {
    const { key, name } = getKey(item, rules, groupConfig);
    const finalKey = name || key;
    const prev = mapLogs[finalKey];

    if (!mapLogs[finalKey]) {
      mapLogs[finalKey] = {
        ...item,
        key: finalKey,
        name
      } as LogDetail
    }

    mapLogs[finalKey].time = (prev ? prev.time : 0) + item.time;
    mapLogs[finalKey].deps = (prev ? [...prev.deps, item] : [item])
  });

  return mapLogs;
}

function getKey(item: Log, rules: Rule[], groupConfig: GroupConfig): { key: string, name?: string } {
  let key = '';
  const comment = item.comment.toLowerCase().trim();

  if (groupConfig.groupByTask) {
    key += item.issue;
  }

  if (groupConfig.groupByComment) {
    key += comment;
  }

  let name = undefined;
  if (groupConfig.groupByRules) {
    for (const index in rules) {
      const rule = rules[index];

      // includes
      const field = rule.field === 'comment' ? comment : (item[rule.field] as string);
      if (rule.values.some(value => field.includes(value))) {
        key += rule.key;
        name = rule.name ? rule.name.trim() : undefined;
        break;
      }
    }
  }

  return {
    key: key || 'develop',
    name,
  };
}
