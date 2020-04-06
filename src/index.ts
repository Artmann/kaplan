#!/usr/bin/env node

import { promises as fs } from 'fs';
import { render } from 'ink';
import meow from 'meow';
import { resolve } from 'path';
import React from 'react';

import App, { AppProps } from './app';

(async function() {

  const cli = meow(`
Usage
  $ kaplan <PATH>

Options
  --sandbox

Examples
  $ kaplan .
`, {
    flags: {
      sandbox: {
        type: 'boolean',
        alias: 's'
      }
    }
  });

  const [ path ] = cli.input;

  if (!path) {
    console.error('A path is reuqired.');

    cli.showHelp();

    process.exit(1);
  }

  const absolutePath = resolve(path);

  // Check that the path exists. Could we show some nicer output here?

  await fs.stat(absolutePath);

  const props: AppProps = {
    isSandboxed: cli.flags.sandbox || false,
    path: absolutePath
  };

  render(React.createElement(App, props));
})();
