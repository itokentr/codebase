declare module '*.wasm' {
  import type {
    Imports,
    WebAssemblyInstantiatedSource,
  } from '@lib/types/web/wasm';
  const init: (
    importObject?: Imports,
  ) => Promise<WebAssemblyInstantiatedSource>;
  export default init;
}
