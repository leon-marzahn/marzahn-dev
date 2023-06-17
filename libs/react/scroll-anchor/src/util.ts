/// --- Hash --- ///

import { RefObject } from 'react';

export function getHash(): string {
  return decodeURI(window.location.hash.slice(1));
}

export function updateHash(hash: string, updateHistory?: boolean): void {
  if (updateHistory) {
    window.location.hash = hash;
  } else {
    const { protocol, host, pathname, search } = window.location;
    window.location.replace(`${protocol}//${host}${pathname}${search}#${hash}`);
  }
}

export function removeHash(): void {
  window.history.replaceState('', document.title, window.location.pathname + window.location.search);
}

/// --- Scroll --- ///

export function getScrollTop(): number {
  return document.body.scrollTop || document.documentElement.scrollTop;
}

export function getElementOffset(element: HTMLElement) {
  const scrollTop = getScrollTop();
  const { top, bottom } = element.getBoundingClientRect();

  return {
    top: Math.floor(top + scrollTop),
    bottom: Math.floor(bottom + scrollTop)
  };
}

export function doesElementContainScrollTop(element: HTMLElement, extraOffset = 0) {
  const scrollTop = getScrollTop();
  const offsetTop = getElementOffset(element).top + extraOffset;
  return scrollTop >= offsetTop && scrollTop < offsetTop + element.offsetHeight;
}

/**
 * Is element2's location move relevant than element1? (Ignore parent-child relationship)
 */
export function checkLocationRelevance(element1: HTMLElement, element2: HTMLElement) {
  const { top: top1, bottom: bottom1 } = getElementOffset(element1);
  const { top: top2, bottom: bottom2 } = getElementOffset(element2);

  if (top1 === top2) {
    if (bottom1 === bottom2) {
      // Top and bottom are the same, return one randomly in a deterministic way
      return element1 < element2;
    }

    // Top of elements is the same, return element has its bottom higher on the page
    return bottom2 < bottom1;
  }

  // Top of elements differ, so return true if tested element has its top lower on the page
  return top2 > top1;
};

/**
 * Is element2's location move relevant than element1? (Considering parent-child relationship)
 */
export function checkElementRelevance(element1: HTMLElement, element2: HTMLElement) {
  if (element1.contains(element2)) {
    // element2 is child, so it gains priority
    return true;
  } else if (!element2.contains(element1) && checkLocationRelevance(element1, element2)) {
    // element1 and element2 are unrelated, but element2 has a better location,
    return true;
  }

  return false;
}

/**
 * Order or priority:
 *
 * 1. Children nodes are more relevant than parent nodes
 * 2. If neither node contains the other, and their top locations differ,
 *    the node with the top lower on the page is more relevant
 * 3. If neither node contains the other, and their top locations are the same,
 *    the node with the bottom higher on the page is more relevant
 * 4. If neither node contains the other, and their top and bottom locations
 *    are the same, a node is chosen at random, in a deterministic way,
 *    to be more relevant.
 */
export function getBestAnchorGivenScrollLocation(
  anchors: Record<string, {
    ref: RefObject<HTMLDivElement>;
    offset?: number;
  }>,
  offset: number
): string | undefined {
  let bestRef: RefObject<HTMLDivElement> | undefined;
  let bestId: string | undefined;

  for (const anchorId of Object.keys(anchors)) {
    const { ref, offset: anchorOffset } = anchors[anchorId];
    const element = ref.current as HTMLElement;

    if (doesElementContainScrollTop(element, anchorOffset ?? offset)) {
      if (!bestRef || checkElementRelevance(bestRef.current as HTMLElement, element)) {
        bestRef = ref;
        bestId = anchorId;
      }
    }
  }

  return bestId;
}
