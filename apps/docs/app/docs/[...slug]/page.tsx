import Markdoc from '@markdoc/markdoc';
import { generateMarkdownMetadata, getMarkdownContent, markdoc } from '../../../util';
import React from 'react';
import fg from 'fast-glob';

export function generateStaticParams(): { slug: string[] }[] {
  const docPaths = fg.sync([
    '**/*.md',
    '!index.md'
  ], { cwd: markdoc.path });
  const segments: { slug: string[] }[] = [];

  for (let docPath of docPaths) {
    docPath = docPath.replace(/\.md/, '');
    segments.push({ slug: docPath.split('/') });
  }

  return segments;
}

export const generateMetadata = generateMarkdownMetadata;

export default function Page({ params: { slug } }: { params: { slug: string[] } }) {
  const { content } = getMarkdownContent(slug);
  return <>
    {Markdoc.renderers.react(content, React, { components: markdoc.components })}
  </>;
}

const dynamicParams = false;
export { dynamicParams };
