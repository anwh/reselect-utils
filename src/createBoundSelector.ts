import { ParametricSelector, Selector } from './types';
import { OutputParametricCachedSelector } from 're-reselect';

export type Diff<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

const generateMappingName = (mapping: {}) =>
  `${Object.keys(mapping).join()} -> ${Object.values(mapping).join()}`;

const innerCreateBoundSelector = <S, P1, P2 extends Partial<P1>, R>(
  baseSelector: ParametricSelector<S, P1, R>,
  binding: P2,
) => {
  const boundSelector = (state: S, props: any) =>
    baseSelector(state, {
      ...(props || {}),
      ...(binding || {}),
    });

  type BoundSelector = Exclude<keyof P1, keyof P2> extends never
    ? Selector<S, R>
    : ParametricSelector<S, Diff<P1, P2>, R>;

  return boundSelector as BoundSelector;
};

export default <S, P1, P2 extends Partial<P1>, R>(
  baseSelector:
    | ParametricSelector<S, P1, R>
    | ReturnType<OutputParametricCachedSelector<S, P1, R, any, any>>,
  binding: P2,
) => {
  const baseName =
    'selectorName' in baseSelector
      ? baseSelector.selectorName
      : baseSelector.name;

  const boundSelector = innerCreateBoundSelector(baseSelector, binding);

  const bindingStructure = Object.keys(binding).reduce(
    (structure, key) => ({
      ...structure,
      [key]: '[*]',
    }),
    {},
  );
  const bindingName = generateMappingName(bindingStructure);

  boundSelector.selectorName = `${baseName} (${bindingName})`;
  boundSelector.dependencies = [baseSelector];

  if ('getMatchingSelector' in baseSelector) {
    const decoratedBaseSelector = Object.assign(
      (state: S, props: P1) => baseSelector(state, props),
      baseSelector,
    );

    decoratedBaseSelector.getMatchingSelector = innerCreateBoundSelector(
      baseSelector.getMatchingSelector,
      binding,
    );

    decoratedBaseSelector.removeMatchingSelector = innerCreateBoundSelector(
      baseSelector.removeMatchingSelector,
      binding,
    );

    boundSelector.dependencies = [decoratedBaseSelector];
  }

  return boundSelector;
};