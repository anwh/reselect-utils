import { Selector, ParametricSelector } from 'reselect';
import {
  CreateSelectorInstance,
  ICacheObject,
  KeySelector,
  KeySelectorCreator,
  OutputCachedSelector,
  OutputParametricCachedSelector,
  ParametricKeySelector,
  ParametricKeySelectorCreator,
} from 're-reselect';

export type NamedSelector<S, R, D = any[]> = Selector<S, R> & {
  selectorName?: string;
  dependencies?: D;
};

export type NamedParametricSelector<S, P, R, D = any[]> = ParametricSelector<
  S,
  P,
  R
> & {
  (state: S, props: P, ...args: any[]): R;
  selectorName?: string;
  dependencies?: D;
};

export type Options<S, C, D> = {
  selectorCreator?: CreateSelectorInstance;
  cacheObject?: ICacheObject;
  keySelector?: KeySelector<S>;
  keySelectorCreator?: KeySelectorCreator<S, C, D>;
};

export type ParametricOptions<S, P, C, D> = {
  selectorCreator?: CreateSelectorInstance;
  cacheObject?: ICacheObject;
  keySelector?: ParametricKeySelector<S, P>;
  keySelectorCreator?: ParametricKeySelectorCreator<S, P, C, D>;
};

export type ReReselectSelector =
  | ReturnType<OutputCachedSelector<any, any, any, any>>
  | ReturnType<OutputParametricCachedSelector<any, any, any, any, any>>;