<template>
  <div>
    <Nuxt class="master-content" />
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/main';

html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px; // 100%
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;

  @media only screen and (min-width: 500px) {
    font-size: 110%;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 120%;
  }
}

body {
  word-wrap: break-word;
  word-break: keep-all;
  color: $base-black;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  outline: none;
}

a {
  text-decoration: none;
  color: inherit;
  -webkit-touch-callout: none !important;
}

.flex-spacer {
  flex: 1;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  height: 0 !important;
  border: none !important;
  background: none !important;
}
</style>
