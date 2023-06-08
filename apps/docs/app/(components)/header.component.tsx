'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { FaDesktop, FaGithub, FaMoon, FaSun } from 'react-icons/fa';
import Image from 'next/image';
import logoImage from '../../public/logo.jpg';
import { IconType } from 'react-icons';
import { Listbox } from '@headlessui/react';

export const HeaderComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={clsx(
      'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8',
      isScrolled ?
        'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75' :
        'dark:bg-transparent'
    )}>
      <div className="mr-6 flex lg:hidden">
        {/*Mobile*/}
      </div>

      <div className="relative flex flex-grow basis-0 items-center">
        <Link href="/"
              aria-label="Home"
              className="flex flex-row items-center">
          <Image src={logoImage} width={36} height={36} alt="Marzahn Dev"/>
          <span className="hidden text-3xl font-bold tracking-wide pl-3 h-9 w-auto text-slate-700 dark:text-indigo-100 lg:block">
            Marzahn Dev
          </span>
        </Link>
      </div>

      <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
        {/*<Search />*/}
      </div>

      <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow">
        <ThemeSelectorComponent className="relative z-10"/>
        <Link href="https://github.com/leon-marzahn/marzahn-dev"
              className="group"
              aria-label="GitHub">
          <FaGithub className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"/>
        </Link>
      </div>
    </header>
  );
};

interface Theme {
  name: string;
  value: 'light' | 'dark' | 'system';
  icon: IconType;
}

export const ThemeSelectorComponent = (props: any) => {
  const themes: Theme[] = [
    {
      name: 'Light',
      value: 'light',
      icon: FaSun
    },
    {
      name: 'Dark',
      value: 'dark',
      icon: FaMoon
    },
    {
      name: 'System',
      value: 'system',
      icon: FaDesktop
    }
  ];

  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  useEffect(() => {
    if (selectedTheme) {
      document.documentElement.setAttribute('data-theme', selectedTheme.value);
    } else {
      setSelectedTheme(themes.find(theme => theme.value === document.documentElement.getAttribute('data-theme')) ?? null);
    }
  }, [selectedTheme]);

  useEffect(() => {
    const handler = () => setSelectedTheme(themes.find(theme => theme.value === (window.localStorage.theme ?? 'system')) ?? null);
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <Listbox as="div"
             value={selectedTheme}
             onChange={setSelectedTheme}
             {...props}>
      <Listbox.Label className="sr-only">Theme</Listbox.Label>
      <Listbox.Button
        className="flex items-center justify-center rounded-lg"
        aria-label={selectedTheme?.name}>
        <FaSun className="hidden h-6 w-6 fill-sky-400 hover:fill-sky-500 dark:hover:fill-sky-300 [[data-theme=light]_&]:block"/>
        <FaMoon className="hidden h-6 w-6 fill-sky-400 hover:fill-sky-500 dark:hover:fill-sky-300 [[data-theme=dark]_&]:block"/>
        <FaSun className="hidden h-6 w-6 fill-slate-400 hover:fill-slate-500 dark:hover:fill-slate-300 [:not(.dark)[data-theme=system]_&]:block"/>
        <FaMoon className="hidden h-6 w-6 fill-slate-400 hover:fill-slate-500 dark:hover:fill-slate-300 [.dark[data-theme=system]_&]:block"/>
      </Listbox.Button>

      <Listbox.Options
        className="absolute left-1/2 top-full mt-3 w-36 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/5">
        {themes.map((theme) => (
          <Listbox.Option key={theme.value}
                          value={theme}
                          className={({ active, selected }) =>
                            clsx(
                              'flex cursor-pointer select-none items-center rounded-[0.625rem] p-1',
                              {
                                'text-sky-500': selected,
                                'text-slate-900 dark:text-white': active && !selected,
                                'text-slate-700 dark:text-slate-400': !active && !selected,
                                'bg-slate-100 dark:bg-slate-900/40': active
                              }
                            )
                          }>
            {({ selected }) => (
              <>
                <div className="rounded-md p-1">
                  <theme.icon
                    className={clsx(
                      'h-4 w-4',
                      selected ? 'fill-sky-400 dark:fill-sky-400' : 'fill-slate-400'
                    )}
                  />
                </div>
                <div className="ml-3">{theme.name}</div>
              </>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};
