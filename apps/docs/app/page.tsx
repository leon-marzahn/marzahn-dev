import { getMarkdownMetadata } from '../util';
import React from 'react';
import { DocServerComponent } from './(components)';

export const metadata = getMarkdownMetadata(['index']);

export default function Page() {
  return <>
    <HeroComponent/>

    <div className="relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12">
      <div className="hidden lg:relative lg:block lg:flex-none">
        <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
        <div className="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
        <div className="absolute bottom-0 right-0 top-28 hidden w-px bg-slate-800 dark:block" />
        <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] w-64 overflow-y-auto overflow-x-hidden py-16 pl-0.5 pr-8 xl:w-72 xl:pr-16">
          {/*<Navigation navigation={navigation} />*/}
        </div>
      </div>

      <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
        <article>
          <DocServerComponent slug={['index']}/>
        </article>
      </div>
    </div>
  </>;
}

const HeroComponent = () => {
  return (
    <div className="overflow-hidden bg-slate-900 dark:-mb-32 dark:mt-[-4.5rem] dark:pb-32 dark:pt-[4.5rem] dark:lg:mt-[-4.75rem] dark:lg:pt-[4.75rem]">
      <div className="py-16 sm:px-2 lg:relative lg:px-0 lg:py-20">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 lg:max-w-8xl lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12">
          <div className="relative z-10 md:text-center lg:text-left">
            {/* ToDo: Add image */}
            <div className="relative">
              <p className="inline bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display text-5xl tracking-tight text-transparent">
                Never miss the cache again.
              </p>

              <p className="mt-3 text-2xl tracking-tight text-slate-400">
                Cache every single thing your app could ever do ahead of time,
                so your code never even has to run at all.
              </p>

              <div className="mt-8 flex gap-4 md:justify-center lg:justify-start">
                {/*<Button href="/">Get started</Button>*/}
                {/*<Button href="/" variant="secondary">*/}
                {/*  View on GitHub*/}
                {/*</Button>*/}
              </div>
            </div>
          </div>

          <div className="relative lg:static xl:pl-10">
          </div>
        </div>
      </div>
    </div>
  )
}
