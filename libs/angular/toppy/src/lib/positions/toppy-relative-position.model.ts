import { NgxToppyPosition, NgxToppyPositionMeta } from './toppy-position.model';
import { NgxToppyConfig, NgxToppyRelativePlacement } from '../toppy.model';
import { getValueAsCss } from '../util';
import { isUndefined } from 'lodash-es';

export interface NgxToppyRelativeConfig extends NgxToppyConfig {
  sourceElement: HTMLElement;
  placement?: string;
  preferredOverflowPlacements?: string[];
  shouldAutoUpdate?: boolean;
  width?: string | number;
  height?: string | number;
}

export class NgxToppyRelativePosition extends NgxToppyPosition {
  private mutationObserver!: MutationObserver;

  public constructor(
    protected override config: NgxToppyRelativeConfig
  ) {
    super(config);

    if (this.config.shouldAutoUpdate) this.observeMutations();
  }

  public override getPosition(hostElement: HTMLElement): NgxToppyPositionMeta {
    const sourceRect = this.config.sourceElement.getBoundingClientRect();
    const hostRect = hostElement.getBoundingClientRect();
    let { width, height } = this.config;

    width = getValueAsCss(sourceRect, width!, 'width');
    height = getValueAsCss(sourceRect, height!, 'height');

    const position = this.calculatePosition(this.config.placement!, sourceRect, hostRect);
    return {
      ...position,
      placement: this.config.placement!,
      bottom: position.top + hostRect.height,
      right: position.left + hostRect.width,
      width,
      height
    }
  }

  protected override getDefaultConfig(config: NgxToppyRelativeConfig): NgxToppyRelativeConfig {
    return {
      ...config,
      placement: !isUndefined(config.placement) ? config.placement : NgxToppyRelativePlacement.TOP,
      width: !isUndefined(config.width) ? config.width : 'auto',
      height: !isUndefined(config.height) ? config.height : 'auto'
    };
  }

  private calculatePosition(
    placement: string,
    sourceRect: DOMRect,
    hostRect: DOMRect
  ): Pick<DOMRect, 'left' | 'top'> {
    const placementInHost = this.calculatePlacementInHost(placement, sourceRect, hostRect);

    if (this.config.shouldAutoUpdate && this.isOverflowing(placementInHost, hostRect)) {
      return this.calculatePosition(this.getNextPlacement(placement), sourceRect, hostRect);
    }

    return placementInHost;
  }

  private calculatePlacementInHost(
    placement: string,
    sourceRect: DOMRect,
    hostRect: DOMRect
  ): Pick<DOMRect, 'left' | 'top'> {
    switch (placement) {
      case NgxToppyRelativePlacement.TOP:
        return { left: sourceRect.left + (sourceRect.width - hostRect.width) / 2, top: sourceRect.top - hostRect.top };
      case NgxToppyRelativePlacement.TOP_LEFT:
        return { left: sourceRect.left, top: sourceRect.top - hostRect.top };
      case NgxToppyRelativePlacement.TOP_RIGHT:
        return { left: sourceRect.left + sourceRect.width - hostRect.width, top: sourceRect.top - hostRect.top };
      default:
        return { left: 0, top: 0 };
    }
  }

  private isOverflowing(placement: Pick<DOMRect, 'left' | 'top'>, hostRect: DOMRect): boolean {
    const { innerHeight, innerWidth } = window;
    const bottom = placement.top + hostRect.height;
    const right = placement.left + hostRect.width;
    return bottom > innerHeight || placement.top <= 0 || placement.left <= 0 || right > innerWidth;
  }

  private getNextPlacement(currentPlacement: string): string {
    let placements: string[] = [];

    switch (this.config.placement) {
      case NgxToppyRelativePlacement.TOP:
        placements = [
          NgxToppyRelativePlacement.TOP,
          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.TOP_RIGHT,

          NgxToppyRelativePlacement.BOTTOM,
          NgxToppyRelativePlacement.BOTTOM_LEFT,
          NgxToppyRelativePlacement.BOTTOM_RIGHT,

          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.RIGHT_BOTTOM,
          NgxToppyRelativePlacement.LEFT_BOTTOM,
          NgxToppyRelativePlacement.RIGHT,
          NgxToppyRelativePlacement.LEFT
        ];
        break;
      case NgxToppyRelativePlacement.TOP_LEFT:
        placements = [
          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.TOP_RIGHT,
          NgxToppyRelativePlacement.TOP,

          NgxToppyRelativePlacement.BOTTOM_LEFT,
          NgxToppyRelativePlacement.BOTTOM_RIGHT,
          NgxToppyRelativePlacement.BOTTOM,

          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.LEFT_BOTTOM,
          NgxToppyRelativePlacement.RIGHT_BOTTOM,
          NgxToppyRelativePlacement.LEFT,
          NgxToppyRelativePlacement.RIGHT
        ];
        break;
      case NgxToppyRelativePlacement.TOP_RIGHT:
        placements = [
          NgxToppyRelativePlacement.TOP_RIGHT,
          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.TOP,

          NgxToppyRelativePlacement.BOTTOM_RIGHT,
          NgxToppyRelativePlacement.BOTTOM_LEFT,
          NgxToppyRelativePlacement.BOTTOM,

          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.RIGHT_BOTTOM,
          NgxToppyRelativePlacement.LEFT_BOTTOM,
          NgxToppyRelativePlacement.RIGHT,
          NgxToppyRelativePlacement.LEFT
        ];
        break;
      case NgxToppyRelativePlacement.BOTTOM:
        placements = [
          NgxToppyRelativePlacement.BOTTOM,
          NgxToppyRelativePlacement.BOTTOM_LEFT,
          NgxToppyRelativePlacement.BOTTOM_RIGHT,

          NgxToppyRelativePlacement.TOP,
          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.TOP_RIGHT,

          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.RIGHT_BOTTOM,
          NgxToppyRelativePlacement.LEFT_BOTTOM,
          NgxToppyRelativePlacement.RIGHT,
          NgxToppyRelativePlacement.LEFT
        ];
        break;
      case NgxToppyRelativePlacement.BOTTOM_LEFT:
        placements = [
          NgxToppyRelativePlacement.BOTTOM_LEFT,
          NgxToppyRelativePlacement.BOTTOM_RIGHT,
          NgxToppyRelativePlacement.BOTTOM,

          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.TOP_RIGHT,
          NgxToppyRelativePlacement.TOP,

          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.LEFT_BOTTOM,
          NgxToppyRelativePlacement.RIGHT_BOTTOM,
          NgxToppyRelativePlacement.LEFT,
          NgxToppyRelativePlacement.RIGHT
        ];
        break;
      case NgxToppyRelativePlacement.BOTTOM_RIGHT:
        placements = [
          NgxToppyRelativePlacement.BOTTOM_RIGHT,
          NgxToppyRelativePlacement.BOTTOM_LEFT,
          NgxToppyRelativePlacement.BOTTOM,

          NgxToppyRelativePlacement.TOP_RIGHT,
          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.TOP,

          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.RIGHT_BOTTOM,
          NgxToppyRelativePlacement.LEFT_BOTTOM,
          NgxToppyRelativePlacement.RIGHT,
          NgxToppyRelativePlacement.LEFT
        ];
        break;
      case NgxToppyRelativePlacement.LEFT:
        placements = [
          NgxToppyRelativePlacement.LEFT,
          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.LEFT_BOTTOM,

          NgxToppyRelativePlacement.RIGHT,
          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.RIGHT_BOTTOM,

          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.BOTTOM_LEFT,
          NgxToppyRelativePlacement.TOP,
          NgxToppyRelativePlacement.BOTTOM,
          NgxToppyRelativePlacement.TOP_RIGHT,
          NgxToppyRelativePlacement.BOTTOM_RIGHT
        ];
        break;
      case NgxToppyRelativePlacement.LEFT_TOP:
        placements = [
          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.LEFT_BOTTOM,
          NgxToppyRelativePlacement.LEFT,

          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.RIGHT_BOTTOM,
          NgxToppyRelativePlacement.RIGHT,

          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.BOTTOM_LEFT,
          NgxToppyRelativePlacement.TOP,
          NgxToppyRelativePlacement.BOTTOM,
          NgxToppyRelativePlacement.TOP_RIGHT,
          NgxToppyRelativePlacement.BOTTOM_RIGHT
        ];
        break;
      case NgxToppyRelativePlacement.LEFT_BOTTOM:
        placements = [
          NgxToppyRelativePlacement.LEFT_BOTTOM,
          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.LEFT,

          NgxToppyRelativePlacement.RIGHT_BOTTOM,
          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.RIGHT,

          NgxToppyRelativePlacement.BOTTOM_LEFT,
          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.BOTTOM,
          NgxToppyRelativePlacement.TOP,
          NgxToppyRelativePlacement.BOTTOM_RIGHT,
          NgxToppyRelativePlacement.TOP_RIGHT
        ];
        break;
      case NgxToppyRelativePlacement.RIGHT:
        placements = [
          NgxToppyRelativePlacement.RIGHT,
          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.RIGHT_BOTTOM,

          NgxToppyRelativePlacement.LEFT,
          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.LEFT_BOTTOM,

          NgxToppyRelativePlacement.TOP_RIGHT,
          NgxToppyRelativePlacement.BOTTOM_RIGHT,
          NgxToppyRelativePlacement.TOP,
          NgxToppyRelativePlacement.BOTTOM,
          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.BOTTOM_LEFT
        ];
        break;
      case NgxToppyRelativePlacement.RIGHT_TOP:
        placements = [
          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.RIGHT_BOTTOM,
          NgxToppyRelativePlacement.RIGHT,

          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.LEFT_BOTTOM,
          NgxToppyRelativePlacement.LEFT,

          NgxToppyRelativePlacement.TOP_RIGHT,
          NgxToppyRelativePlacement.BOTTOM_RIGHT,
          NgxToppyRelativePlacement.TOP,
          NgxToppyRelativePlacement.BOTTOM,
          NgxToppyRelativePlacement.TOP_LEFT,
          NgxToppyRelativePlacement.BOTTOM_LEFT
        ];
        break;
      case NgxToppyRelativePlacement.RIGHT_BOTTOM:
        placements = [
          NgxToppyRelativePlacement.RIGHT_BOTTOM,
          NgxToppyRelativePlacement.RIGHT_TOP,
          NgxToppyRelativePlacement.RIGHT,

          NgxToppyRelativePlacement.LEFT_BOTTOM,
          NgxToppyRelativePlacement.LEFT_TOP,
          NgxToppyRelativePlacement.LEFT,

          NgxToppyRelativePlacement.BOTTOM_RIGHT,
          NgxToppyRelativePlacement.TOP_RIGHT,
          NgxToppyRelativePlacement.BOTTOM,
          NgxToppyRelativePlacement.TOP,
          NgxToppyRelativePlacement.BOTTOM_LEFT,
          NgxToppyRelativePlacement.TOP_LEFT
        ];
        break;
    }

    if (this.config.preferredOverflowPlacements) placements = this.config.preferredOverflowPlacements;

    const index = placements.indexOf(currentPlacement);
    if (index + 1 > placements.length) return this.config.placement!;
    return placements[index + 1];
  }

  private observeMutations(): void {
    if (this.mutationObserver) this.mutationObserver.disconnect();

    this.mutationObserver = new MutationObserver(() => null);
    this.mutationObserver.observe(this.config.sourceElement, {
      attributeFilter: ['style']
    });
  }
}
