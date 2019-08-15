<template>
  <div class="cartoon-specific">
    <div v-if="!episodes.error" class="cartoon">
      <div class="cartoon-info">
        <div class="cartoon-thumbs-container">
          <img v-for="(thumb) in episodes.info.thumbs" :key="thumb" :src="thumb" alt="" class="thumb">
        </div>
        <div class="cartoon-thumbs-container wall">
          <img v-for="(thumb) in episodes.info.thumbs" :key="thumb" :src="thumb" alt="" class="thumb">
        </div>
        <div class="details">
          <h1 class="cartoon-title">
            {{ episodes.info.title }}
          </h1>
          <h2 class="cartoon-authors">
            {{ episodes.info.authors.join(' · ') }}
          </h2>
        </div>
      </div>

      <div class="episodes-container">
        <div v-for="item in episodes.list" :key="item.title" class="episode-item">
          <NuxtLink class="episode-link" to="/" />

          <div class="ei-thumb-wrapper">
            <img class="ei-thumb" :src="item.thumbSrc" alt="">
          </div>

          <div class="ei-info-container">
            <h1 class="ei-title">
              {{ item.title }}
            </h1>
          </div>
        </div>

        <div v-for="i in 4" :key="`dummy-${i}`" class="flex-spacer episode-item" />
      </div>
    </div>

    <!-- 에러: 성인 웹툰 -->
    <div v-else class="error">
      <h1>성인 웹툰은 현재 지원되지 않습니다.</h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  middleware ({ redirect, route }) {
    // If there is no param for cartoonId,
    // redirect to today
    if (!route.params.cartoonId) {
      return redirect('/')
    }
  },
  asyncData ({ route }) {
    return axios
      .get('http://localhost:3000/api/episodes', {
        params: {
          cartoonId: route.params.cartoonId
        }
      })
      .then((response) => {
        return {
          episodes: response.data
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.cartoon-specific {
  .cartoon-info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    background-color: rgba(#fff, 0.5);

    .cartoon-thumbs-container {
      position: relative;
      display: inline-block;
      width: 50vh;
      max-width: 90%;

      &.wall {
        position: fixed;
        width: 100vh;
        max-width: none;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        filter: blur(30vh) saturate(1.5);
        z-index: -1;
      }

      .thumb {
        display: block;

        &:last-child {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        &:first-child {
          position: relative;
          width: 100%;
          height: auto;
        }
      }
    }

    .details {
      margin: space(3) 0;
      text-align: center;

      .cartoon-title {
        font-size: 1.5rem;
        font-weight: 700;
      }

      .cartoon-authors {
        font-weight: 400;
        font-size: 0.8rem;
        color: #808080;
        margin-top: space(1);
      }
    }
  }

  .episodes-container {
    padding-top: space(3);
    padding-bottom: space(6);
    width: calc(100% - #{space(2) * 2});
    max-width: 22rem;
    margin: auto;

    .episode-item {
      margin-bottom: space(2);
      position: relative;
      background-color: rgba(#fff, 0.4);
      border-radius: radius(3);
      padding: space(2);
      box-shadow: 0 0.2rem 1rem rgba(#000, 0.1);

      .episode-link {
        position: absolute;
        z-index: 6;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      display: flex;

      .ei-thumb-wrapper {
        width: 5rem;
        height: 3rem;
        // box-shadow: 0 0.1rem 0.3rem rgba(#000, 0.2);
        border-radius: radius(2);
        overflow: hidden;

        .ei-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .ei-info-container {
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: space(3);

        .ei-title {
          font-weight: weight(4);
          font-size: body(3);
        }
      }
    }
  }

  .error {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 2rem);
    margin: auto;

    h1 {
      font-size: 1.5rem;
    }
  }
}
</style>
