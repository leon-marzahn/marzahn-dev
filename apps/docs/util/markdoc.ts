import Markdoc, { Config, RenderableTreeNode } from '@markdoc/markdoc';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import process from 'process';
import { Metadata } from 'next';

export interface MarkdownContent {
  title: string;
  pageTitle: string;
  pageDescription: string;
  content: RenderableTreeNode;
}

export const markdoc: {
  path: string;
  config: Config;
  components: object
} = {
  path: path.join(process.cwd(), './markdoc'),
  config: {
    nodes: {},
    tags: {}
  },
  components: {}
};

export function getMarkdownContent(slug: string[]): MarkdownContent {
  const source = fs.readFileSync(path.join(markdoc.path, `${slug.join('/')}.md`), 'utf-8');
  const matterResult = matter(source);
  const { title, pageTitle, pageDescription } = matterResult.data;
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast, markdoc.config);
  return { title, pageTitle, pageDescription, content };
}

export function getMarkdownMetadata(slug: string[]): Metadata {
  const { pageTitle, pageDescription } = getMarkdownContent(slug);
  return { title: pageTitle, description: pageDescription };
}

export function generateMarkdownMetadata({ params: { slug } }: { params: { slug: string[] } }): Metadata {
  return getMarkdownMetadata(slug);
}
