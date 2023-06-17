import React, { ComponentPropsWithoutRef, ReactNode, useEffect, useRef } from 'react';
import { SCROLL_ANCHOR_MANAGER } from './scroll-anchor-manager';

interface ScrollAnchorComponentProps extends ComponentPropsWithoutRef<'div'> {
  anchor: string;
  children: ReactNode;
  offset?: number;
}

export function ScrollAnchor({
                               anchor,
                               children,
                               offset,
                               ...props
                             }: ScrollAnchorComponentProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    SCROLL_ANCHOR_MANAGER.addAnchor(anchor, elementRef, offset);
    return () => SCROLL_ANCHOR_MANAGER.removeAnchor(anchor);
  }, []);

  return (
    <div ref={elementRef} {...props}>
      {children}
    </div>
  );
}

export const ScrollAnchorComponent = ScrollAnchor;
