import { CachedSelector } from './types';

export const getSelectorName = (selector: {
  name: string;
  selectorName?: string;
}): string => {
  if ('selectorName' in selector && selector.selectorName) {
    return selector.selectorName;
  }

  return selector.name;
};

export const isCachedSelector = (
  selector: unknown,
): selector is CachedSelector => {
  return selector instanceof Object && 'keySelector' in selector;
};

export const defineDynamicSelectorName = (
  selector: unknown,
  selectorNameGetter: () => string,
) => {
  let overriddenSelectorName: string;
  Object.defineProperty(selector, 'selectorName', {
    configurable: true,
    get: () => {
      return overriddenSelectorName ?? selectorNameGetter();
    },
    set: (value: string) => {
      overriddenSelectorName = value;
    },
  });
};

let debugMode = true;

export const isDebugMode = () => debugMode;

export const setDebugMode = (value: boolean) => {
  debugMode = value;
};
