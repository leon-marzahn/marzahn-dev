import { getMarkdownContent, markdoc } from '../../util';
import Markdoc from '@markdoc/markdoc';
import React from 'react';

export const DocServerComponent = ({ slug }: { slug: string[] }) => {
  const { content } = getMarkdownContent(slug);
  return <>
    {Markdoc.renderers.react(content, React, { components: markdoc.components })}
  </>;
};
