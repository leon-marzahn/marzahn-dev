import { RefObject } from 'react';
import jump from 'jump.js';
import { getBestAnchorGivenScrollLocation, getHash, removeHash, updateHash } from './util';

export interface ScrollAnchorBaseConfig {
  /**
   * The offset from the top of the element. Use negative value to account for headers for example.
   *
   * @default 0
   */
  offset: number;

  /**
   * The duration in milliseconds it will take to scroll to anchors.
   *
   * @default 400
   */
  scrollDuration: number;

  /**
   * An override function for updating the hash. Can be used with react router for example.
   *
   * @param anchorId The anchor id
   */
  customAnchorHashUpdater?: (anchorId: string) => void;
}

export interface ScrollAnchorConfig extends ScrollAnchorBaseConfig {
  /**
   * If set, will keep the last anchor hash when scrolling past any anchors.
   *
   * @default false
   */
  keepLastAnchorHash: boolean;

  /**
   * If set, will automatically update the page hash as you scroll past anchors. (Or run the {@link customAnchorHashUpdater} if set)
   *
   * @default true
   */
  autoUpdateAnchorHash: boolean;
}

const DEFAULT_CONFIG: ScrollAnchorConfig = {
  offset: 0,
  scrollDuration: 400,
  keepLastAnchorHash: false,
  autoUpdateAnchorHash: true
};

export class ScrollAnchorManager {
  private _anchors: Record<string, {
    ref: RefObject<HTMLDivElement>;
    config?: Partial<ScrollAnchorConfig>;
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

  /**
   * Add an anchor to the manager.
   *
   * @param anchorId The anchor id
   * @param ref The ref of the anchor component
   * @param config The anchor override config
   */
  public addAnchor(
    anchorId: string,
    ref: RefObject<HTMLDivElement>,
    config?: Partial<ScrollAnchorBaseConfig>
  ) {
    if (!Object.keys(this._anchors).length) this.addListeners();
    this._anchors[anchorId] = { ref, config };

    const hash = getHash();
    if (hash === anchorId) this.goToAnchor(anchorId);
  }

  /**
   * Remove an anchor from the manager by id
   *
   * @param anchorId The anchor id
   */
  public removeAnchor(anchorId: string): void {
    delete this._anchors[anchorId];
    if (!Object.keys(this._anchors).length) this.removeListeners();
  }

  /**
   * Scroll to given anchor.
   *
   * @param anchorId The anchor id
   */
  public goToAnchor(anchorId: string): void {
    const anchor = this._anchors[anchorId];
    if (!anchor || !anchor.ref.current) return;

    const { ref, config } = anchor;
    this._scrolling = true;
    jump(ref.current as HTMLElement, {
      duration: config?.scrollDuration ?? this._config.scrollDuration,
      offset: config?.offset ?? this._config.offset,
      callback: () => this._scrolling = false
    });
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

    const bestAnchorId = getBestAnchorGivenScrollLocation(this._anchors, this._config.offset);

    if (this._config.autoUpdateAnchorHash && bestAnchorId && getHash() !== bestAnchorId) {
      this._forcedHash = true;

      const { config: anchorConfig } = this._anchors[bestAnchorId];
      const customAnchorHashUpdater = anchorConfig?.customAnchorHashUpdater ?? this._config.customAnchorHashUpdater;

      if (customAnchorHashUpdater) {
        customAnchorHashUpdater(bestAnchorId);
      } else {
        updateHash(bestAnchorId);
      }
    } else if (!bestAnchorId && !this._config.keepLastAnchorHash) {
      removeHash();
    }
  }

  private onHashChange(): void {
    if (this._forcedHash) {
      this._forcedHash = false;
      return;
    }

    this.goToAnchor(getHash());
  }
}

export const SCROLL_ANCHOR_MANAGER = new ScrollAnchorManager();
