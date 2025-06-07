# rsbuild `buildCache` Bug Report

## How to Reproduce the Issue

0. Run `pnpm install`
1. Run `pnpm build`
2. Uncomment lines 14 to 18 in `src/router.ts`
3. Run `pnpm build` again

## Workaround

### Method 1

Set the `buildCache` option to `false` in `rsbuild.config.ts`.

### Method 2

`tools.rspack.optimization.concatenateModules` can be set to `false` in `rsbuild.config.ts`.

## Note

This is a sample project in progress. You can observe basic Vue SSR behavior by running `pnpm dev`.
