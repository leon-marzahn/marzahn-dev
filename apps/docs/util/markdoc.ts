import Markdoc, { Config, RenderableTreeNode } from '@markdoc/markdoc';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import process from 'process';
import { Metadata } from 'next';
import fg from 'fast-glob';

export interface MarkdownMatter {
  section?: string;
  title: string;
  pageTitle: string;
  pageDescription: string;
}

export interface MarkdownContent extends MarkdownMatter {
  content: RenderableTreeNode;
}

export interface MarkdownNavigationItem {
  title: string;
  children?: MarkdownNavigationItem[];
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

export function getMarkdownPaths(): string[] {
  return fg.sync([
    '**/*.md',
    '!index.md'
  ], { cwd: markdoc.path });
}

export function getMarkdownSource(slug: string[]): string {
  return fs.readFileSync(path.join(markdoc.path, `${slug.join('/')}.md`), 'utf-8');
}

export function getMarkdownMatter(source: string): MarkdownMatter {
  const matterResult = matter(source);
  return matterResult.data as MarkdownMatter;
}

export function getMarkdownContent(slug: string[]): MarkdownContent {
  const source = getMarkdownSource(slug);
  const { title, pageTitle, pageDescription, section } = getMarkdownMatter(source);
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast, markdoc.config);
  return { section, title, pageTitle, pageDescription, content };
}

export function getMarkdownNavigation(): MarkdownNavigationItem[] {
  const markdownPaths = getMarkdownPaths();
  const items = markdownPaths
    .map(markdownPath => getMarkdownSource(
      markdownPath
        .replace(/\.md/, '')
        .split('/')
    ));
  const groupedItems = groupB;
}

export function getMarkdownMetadata(slug: string[]): Metadata {
  const { pageTitle, pageDescription } = getMarkdownContent(slug);
  return { title: pageTitle, description: pageDescription };
}

export function generateMarkdownMetadata({ params: { slug } }: { params: { slug: string[] } }): Metadata {
  return getMarkdownMetadata(slug);
}
