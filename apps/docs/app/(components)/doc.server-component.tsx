import { getMarkdownContent, markdoc } from '../../util';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import clsx from 'clsx';

export const DocServerComponent = ({ slug }: { slug: string[] }) => {
  const { content, title, section } = getMarkdownContent(slug);

  return <>
    {(title || section) && (
      <header className="mb-9 space-y-1">
        {section && <p className="font-display text-sm font-medium text-sky-500">{section}</p>}
        {title && <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">{title}</h1>}
      </header>
    )}

    <div className={clsx(
      'prose prose-slate max-w-none dark:prose-invert dark:text-slate-400',
      // Headings
      'prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem]',
      // lead
      'prose-lead:text-slate-500 dark:prose-lead:text-slate-400',
      // Links
      'prose-a:font-semibold dark:prose-a:text-sky-400',
      // Links underline
      'prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px]',
      // pre
      'prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10',
      // hr
      'dark:prose-hr:border-slate-800'
    )}>
      {Markdoc.renderers.react(content, React, { components: markdoc.components })}
    </div>
  </>;
};
