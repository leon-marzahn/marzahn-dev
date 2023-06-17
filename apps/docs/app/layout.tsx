import './global.scss';
import React, { PropsWithChildren } from 'react';
import { HeaderComponent } from './(components)';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en"
          className="antialiased [font-feature-settings:'ss01']"
          suppressHydrationWarning={true}>
      <head>
        <script id="theme-script"
                src="./theme-script.js"
                async/>
      </head>

      <body className="bg-white dark:bg-slate-900">
        <HeaderComponent/>
        {children}
      </body>
    </html>
  );
}
