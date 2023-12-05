/* eslint-disable global-require */

// polyfills and vendors

if (!window._babelPolyfill) {
  require('@babel/polyfill');
}
if(!window._babelCore){
  require('@babel/core');
}