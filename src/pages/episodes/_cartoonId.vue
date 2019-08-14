<template>
  <div class="cartoon-specific">
    <h1 class="cartoon-title"></h1>
    <h2 class="cartoon-authors"></h2>

    <div class="episodes-container">
      <nuxt-link class="expisode-link" v-for="item in episodes.list" :key="item.title" to="/">
        <div class="episode-item">{{ item.title }}</div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  asyncData({ route }) {
    return axios
      .get('http://localhost:3000/api/episodes', {
        params: {
          cartoonId: route.params.cartoonId
        }
      })
      .then(response => {
        return {
          episodes: response.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="scss">
.cartoon-specific {
  .cartoon-title {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .cartoon-authors {
    font-weight: 400;
    font-size: 0.9rem;
    color: #808080;
  }

  .episodes-container {
    width: calc(100% - 2rem);
    margin: auto;

    .episode-link {
      .episode-item {
      }
    }
  }
}
</style>