import { NgxToppyConfig } from '../toppy.model';

export interface NgxToppyPositionMeta {
  placement: string;
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number | string;
  width: number | string;
}

export abstract class NgxToppyPosition {
  protected constructor(
    protected config: NgxToppyConfig = {}
  ) {
    this.config = this.getDefaultConfig(config);
  }

  public abstract getPosition(hostElement: HTMLElement): NgxToppyPositionMeta;

  protected abstract getDefaultConfig(config: NgxToppyConfig): NgxToppyConfig;
}
