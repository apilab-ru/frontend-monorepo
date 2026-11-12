/// <reference lib="webworker" />
import { GroupConfig, Log, LogDetail, Rule } from '../interfaces';

const CHUNK_SIZE = 500;

type WorkerRequest =
  | { id: number; cancel: true }
  | { id: number; list: Log[]; rules: Rule[]; groupConfig: GroupConfig };

const pendingChunks = new Map<number, ReturnType<typeof setTimeout>>();

addEventListener('message', ({ data }: MessageEvent<WorkerRequest>) => {
  const { id } = data;

  if ('cancel' in data) {
    clearTimeout(pendingChunks.get(id));
    pendingChunks.delete(id);

    return;
  }

  const { list, rules, groupConfig } = data;
  const groups: Record<string, LogDetail> = Object.create(null);
  let offset = 0;
  const processChunk = () => {
    groupLogs(groups, list.slice(offset, offset + CHUNK_SIZE), rules, groupConfig);
    offset += CHUNK_SIZE;

    if (offset < list.length) {
      pendingChunks.set(id, setTimeout(processChunk));
    } else {
      pendingChunks.delete(id);
      postMessage({ id, logs: Object.values(groups).sort((a, b) => b.time - a.time) });
    }
  };
  processChunk();
});

function groupLogs(mapLogs: Record<string, LogDetail>, list: Log[], rules: Rule[], groupConfig: GroupConfig): Record<string, LogDetail> {
  list.forEach((item) => {
    const { key, name } = getKey(item, rules, groupConfig);
    const finalKey = name || key;
    const prev = mapLogs[finalKey];

    if (prev) {
      prev.time += item.time;
      prev.deps.push(item);
    } else {
      mapLogs[finalKey] = { ...item, key: finalKey, name, deps: [item] };
    }

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

  let name: string | undefined;

  if (groupConfig.groupByRules) {
    for (const rule of rules) {

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
