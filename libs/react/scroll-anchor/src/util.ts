/// --- Hash --- ///

export function getHash(): string {
  return decodeURI(window.location.hash.slice(1));
}

export function updateHash(hash: string, updateHistory?: boolean): void {
  if (updateHistory) {
    window.location.hash = hash;
  } else {
    window.location.replace(`#${hash}`);
  }
}

export function removeHash(): void {
  window.history.replaceState('', document.title, window.location.pathname + window.location.search);
}

/// --- Scroll --- ///

export function getScrollTop(): number {
  return document.body.scrollTop || document.documentElement.scrollTop;
}
