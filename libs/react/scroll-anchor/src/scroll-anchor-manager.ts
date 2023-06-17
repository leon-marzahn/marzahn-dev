import { RefObject } from 'react';
import jump from 'jump.js';
import { getBestAnchorGivenScrollLocation, getHash, removeHash, updateHash } from './util';

export interface ScrollAnchorConfig {
  offset: number;
  scrollDuration: number;
  keepLastAnchorHash: boolean;
}

const DEFAULT_CONFIG: ScrollAnchorConfig = {
  offset: 0,
  scrollDuration: 400,
  keepLastAnchorHash: false
};

export class ScrollAnchorManager {
  private _anchors: Record<string, {
    ref: RefObject<HTMLDivElement>;
    offset?: number;
  }> = {};
  private _forcedHash = false;
  private _scrolling = false;
  private _config: ScrollAnchorConfig = DEFAULT_CONFIG;

  private scrollFn = () => this.onScroll();
  private hashChangeFn = () => this.onHashChange();

  public configure(config: Partial<ScrollAnchorConfig>) {
    this._config = {
      ...DEFAULT_CONFIG,
      ...this._config,
      ...config
    };
  }

  public addAnchor(
    anchorId: string,
    ref: RefObject<HTMLDivElement>,
    offset?: number
  ) {
    if (!Object.keys(this._anchors).length) this.addListeners();
    this._anchors[anchorId] = { ref, offset };
  }

  public removeAnchor(anchorId: string): void {
    delete this._anchors[anchorId];
    if (!Object.keys(this._anchors).length) this.removeListeners();
  }

  private addListeners(): void {
    window.addEventListener('scroll', this.scrollFn, false);
    window.addEventListener('hashchange', this.hashChangeFn);
  }

  private removeListeners(): void {
    window.removeEventListener('scroll', this.scrollFn, false);
    window.removeEventListener('hashchange', this.hashChangeFn);
  }

  private onScroll(): void {
    if (this._scrolling) return;

    const { offset, keepLastAnchorHash } = this._config;
    const bestAnchorId = getBestAnchorGivenScrollLocation(this._anchors, offset);

    if (bestAnchorId && getHash() !== bestAnchorId) {
      this._forcedHash = true;
      updateHash(bestAnchorId);
    } else if (!bestAnchorId && !keepLastAnchorHash) {
      removeHash();
    }
  }

  private onHashChange(): void {
    if (this._forcedHash) {
      this._forcedHash = false;
      return;
    }

    this.goToSection(getHash());
  }

  private goToSection(anchorId: string): void {
    const anchor = this._anchors[anchorId];

    if (!anchor || !anchor.ref.current) {
      console.error(`Anchor with anchor id ${anchorId} could not be found.`);
      return;
    }

    const { ref, offset } = anchor;
    this._scrolling = true;
    jump(ref.current as HTMLElement, {
      duration: this._config.scrollDuration,
      offset: offset ?? this._config.offset,
      callback: () => this._scrolling = false
    });
  }
}

export const SCROLL_ANCHOR_MANAGER = new ScrollAnchorManager();
