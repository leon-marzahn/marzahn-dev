import { AnimationStyleMetadata } from '@angular/animations';
import { TemplateRef, Type } from '@angular/core';

/// --- Placements --- ///

enum NgxToppySharedPlacement {
  TOP = 't',
  LEFT = 'l',
  RIGHT = 'r',
  BOTTOM = 'b'
}

enum NgxToppyRelativeOnlyPlacement {
  TOP_LEFT = 'tl',
  TOP_RIGHT = 'tr',
  BOTTOM_LEFT = 'bl',
  BOTTOM_RIGHT = 'br',
  LEFT_BOTTOM = 'lb',
  LEFT_TOP = 'lt',
  RIGHT_BOTTOM = 'rb',
  RIGHT_TOP = 'rt',
  CENTER = 'c'
}

export const NgxToppyRelativePlacement = {
  ...NgxToppySharedPlacement,
  ...NgxToppyRelativeOnlyPlacement
};
export const NgxToppySlidePlacement = {
  ...NgxToppySharedPlacement
};

export type NgxToppyRelativePlacement = NgxToppySharedPlacement | NgxToppyRelativeOnlyPlacement;
export type NgxToppySlidePlacement = NgxToppySharedPlacement;

/// --- Config --- ///

export interface NgxToppyConfig {
  containerClass?: string | string[];
  containerStyle?: AnimationStyleMetadata;

  wrapperClass?: string | string[];

  showBackdrop?: boolean;

  backdropClass?: string | string[];

  listenToWindowEvents?: boolean;
  shouldCloseOnDocumentClick?: boolean;
  shouldCloseOnEscape?: boolean;

  windowResizeCallback?: () => void;
  documentClickCallback?: () => void;
}

/// --- Events --- ///

export enum NgxToppyEvent {
  OPENED,
  CLOSED,
  DYNAMIC_POSITION_CHANGED,
  DETACHED,
  POSITION_UPDATED,
  COMPONENT_INSERTED
}

/// --- Content --- ///

export enum NgxToppyContentType {
  STRING,
  HTML,
  TEMPLATE,
  COMPONENT
}

interface NgxToppyBaseContent<PropsType = unknown> {
  type: NgxToppyContentType;
  props?: PropsType;
}

interface NgxToppyStringContent<PropsType = unknown> extends NgxToppyBaseContent<PropsType> {
  type: NgxToppyContentType.STRING;
  data: string;
}

interface NgxToppyHtmlContent<PropsType = unknown> extends NgxToppyBaseContent<PropsType> {
  type: NgxToppyContentType.HTML;
  data: string;
}

interface NgxToppyTemplateContent<TemplateType = TemplateRef<unknown>, PropsType = unknown> extends NgxToppyBaseContent<PropsType> {
  type: NgxToppyContentType.TEMPLATE;
  data: TemplateType;
}

interface NgxToppyComponentContent<ComponentType = Type<unknown>, PropsType = unknown> extends NgxToppyBaseContent<PropsType> {
  type: NgxToppyContentType.COMPONENT;
  data: ComponentType;
}

export type NgxToppyContent = NgxToppyStringContent | NgxToppyHtmlContent | NgxToppyTemplateContent | NgxToppyComponentContent;
