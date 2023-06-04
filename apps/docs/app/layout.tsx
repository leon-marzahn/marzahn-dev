import './global.scss';
import { PropsWithChildren } from 'react';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en"
          className="antialiased [font-feature-settings:'ss01']">
      <body className="bg-white dark:bg-slate-900">
        {children}
      </body>
    </html>
  );
}
