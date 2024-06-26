import { CachedSelector, Path } from './types';

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
): selector is CachedSelector =>
  selector instanceof Object && 'keySelector' in selector;

export const defineDynamicSelectorName = (
  selector: unknown,
  selectorNameGetter: () => string,
) => {
  let overriddenSelectorName: string;
  Object.defineProperty(selector, 'selectorName', {
    configurable: true,
    get: () => overriddenSelectorName ?? selectorNameGetter(),
    set: (value: string) => {
      overriddenSelectorName = value;
    },
  });
};

export const defaultKeySelector = () => '<DefaultKey>';

let debugMode = false;

export const isDebugMode = () => debugMode;

export const setDebugMode = (value: boolean) => {
  debugMode = value;
};

export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object';

export const arePathsEqual = (path: Path, anotherPath: Path) => {
  if (path.length !== anotherPath.length) {
    return false;
  }

  for (let i = 0; i < path.length; i += 1) {
    if (path[i] !== anotherPath[i]) {
      return false;
    }
  }

  return true;
};

export const getObjectPaths = (
  value: unknown,
  parentPath: Path = [],
): Path[] => {
  if (!isObject(value)) return [parentPath];

  return Object.keys(value).reduce<Path[]>((result, key) => {
    const paths = getObjectPaths(value[key], parentPath.concat([key]));
    return result.concat(paths);
  }, []);
};
