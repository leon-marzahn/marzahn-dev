import { getMarkdownMetadata } from '../../util';
import React from 'react';
import { DocServerComponent } from '../(components)';

export const metadata = getMarkdownMetadata(['index']);

export default function Page() {
  return <DocServerComponent slug={['index']}/>;
}
