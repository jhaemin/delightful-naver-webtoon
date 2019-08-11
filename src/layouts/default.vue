<template>
  <div>
    <nuxt class="master-content" />
  </div>
</template>

<style lang="scss">
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
    font-size: 130%;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 150%;
  }
}

body {
  word-wrap: break-word;
  word-break: keep-all;
  color: #222;
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
</style>
