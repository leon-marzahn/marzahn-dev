import React, { ComponentPropsWithoutRef, ReactNode, useEffect, useRef } from 'react';
import { SCROLL_ANCHOR_MANAGER, ScrollAnchorBaseConfig } from './scroll-anchor-manager';

interface ScrollAnchorComponentProps extends ComponentPropsWithoutRef<'div'>, Partial<ScrollAnchorBaseConfig> {
  /**
   * The id of the anchor.
   */
  anchor: string;

  /**
   * Children elements
   */
  children: ReactNode;
}

export function ScrollAnchor({
                               anchor,
                               children,
                               offset,
                               scrollDuration,
                               customAnchorHashUpdater,
                               ...props
                             }: ScrollAnchorComponentProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;
    SCROLL_ANCHOR_MANAGER.addAnchor(anchor, elementRef, {
      offset,
      scrollDuration,
      customAnchorHashUpdater
    });
    return () => SCROLL_ANCHOR_MANAGER.removeAnchor(anchor);
  }, []);

  return (
    <div ref={elementRef} {...props}>
      {children}
    </div>
  );
}

export const ScrollAnchorComponent = ScrollAnchor;
