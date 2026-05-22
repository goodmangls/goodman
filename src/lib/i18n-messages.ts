import en from '../../messages/en.json';
import koOverrides from '../../messages/ko.json';

type MessageTree = Record<string, unknown>;

function isPlainObject(value: unknown): value is MessageTree {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(base: MessageTree, override: MessageTree): MessageTree {
  const result: MessageTree = { ...base };
  for (const key of Object.keys(override)) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (isPlainObject(baseVal) && isPlainObject(overrideVal)) {
      result[key] = deepMerge(baseVal, overrideVal);
    } else {
      result[key] = overrideVal;
    }
  }
  return result;
}

export const messages = {
  en: en as MessageTree,
  ko: deepMerge(en as MessageTree, koOverrides as MessageTree),
};

export type Locale = keyof typeof messages;

export function getMessage(tree: MessageTree, key: string): string {
  const value = key.split('.').reduce<unknown>((node, part) => {
    if (isPlainObject(node)) return node[part];
    return undefined;
  }, tree);
  return typeof value === 'string' ? value : key;
}
