import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc';
import { components, config } from '../../markdoc.config';
import { Metadata } from 'next';
import process from 'process';
import React from 'react';
import fg from 'fast-glob';

const DOCS_PATH = path.join(process.cwd(), './app/docs/(docs)');

interface MarkdownContent {
  title: string;
  pagePath: string;
  pageTitle: string;
  pageDescription: string;
  content: RenderableTreeNode;
}

const dynamicParams = false;
export { dynamicParams };

export function generateStaticParams(): { slug: string[] }[] {
  const docPaths = fg.sync('**/*.md', { cwd: DOCS_PATH });

  return docPaths.map(docPath => {
    const source = fs.readFileSync(path.join(DOCS_PATH, docPath), 'utf-8');
    const matterResult = matter(source);
    const { pagePath } = matterResult.data as { pagePath: string };

    return { slug: pagePath.split('/') };
  });
}

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const { title } = await getMarkdownContent(params.slug);
  return { title };
}

export default function Page({ params: { slug } }: { params: { slug: string[] } }) {
  const { content } = getMarkdownContent(slug);
  return <>
    {Markdoc.renderers.react(content, React, { components })}
  </>;
}

function getMarkdownContent(slug: string[]): MarkdownContent {
  const docPath = slug.map((x, index) => index < (slug.length - 1) ? `(${x})` : x).join('/');
  const source = fs.readFileSync(path.join(DOCS_PATH, `${docPath}.md`), 'utf-8');
  const matterResult = matter(source);
  const { title, pagePath, pageTitle, pageDescription } = matterResult.data;
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast, config);
  return { title, pagePath, pageTitle, pageDescription, content };
}
