#!/usr/bin/env node --enable-source-maps
import { main } from '../src/cli/main.ts';
await main(process.argv.slice(2));
