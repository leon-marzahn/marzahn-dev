import { isUndefined } from 'lodash-es';

type KeysOfType<T, TProp> = { [P in keyof T]: T[P] extends TProp ? P : never }[keyof T];

export function getValueAsCss(
  sourceElement: DOMRect,
  value: number | string,
  key: KeysOfType<DOMRect, string | number>
): number | string {
  if (typeof value === 'number') return value;

  if (value.endsWith('%') && key) {
    return getPercentageValueAsCss(sourceElement[key], Number(value.slice(0, -1)));
  }

  return value;
}

export function getPercentageValueAsCss(max: number | string, percentage: number): string {
  if (percentage > 100) percentage = 100;
  return `calc(${max}px - ${100 - percentage}%)`;
}
