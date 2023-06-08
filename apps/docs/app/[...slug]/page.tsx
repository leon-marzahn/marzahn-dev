import Markdoc from '@markdoc/markdoc';
import { generateMarkdownMetadata, getMarkdownContent, getMarkdownPaths, markdoc } from '../../util';
import React from 'react';

export function generateStaticParams(): { slug: string[] }[] {
  const docPaths = getMarkdownPaths();
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
