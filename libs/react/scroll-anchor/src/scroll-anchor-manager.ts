import { RefObject } from 'react';
import jump from 'jump.js';

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
  private _config: ScrollAnchorConfig = DEFAULT_CONFIG;

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

  private goToSection(anchorId: string): void {
    const anchor = this._anchors[anchorId];

    if (!anchor || !anchor.ref.current) {
      console.error(`Anchor with anchor id ${anchorId} could not be found.`);
      return;
    }

    const { ref, offset } = anchor;
    jump(ref.current as HTMLElement, {
      duration: this._config.scrollDuration,
      offset: offset ?? this._config.offset
    });
  }

  private addListeners(): void {
    window.addEventListener('scroll', this.onScroll, false);
    window.addEventListener('hashchange', this.onHashChange);
  }

  private removeListeners(): void {
    window.removeEventListener('scroll', this.onScroll, false);
    window.removeEventListener('hashchange', this.onHashChange);
  }

  private onScroll(): void {

  }

  private onHashChange(): void {

  }
}

export const SCROLL_ANCHOR_MANAGER = new ScrollAnchorManager();
