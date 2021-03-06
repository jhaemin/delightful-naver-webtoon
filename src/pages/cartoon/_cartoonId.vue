<template>
  <div class="cartoon-specific">
    <div v-if="!episodes.error" class="cartoon">
      <div class="cartoon-info">
        <div class="cartoon-thumbs-container">
          <img v-for="(thumb) in episodes.info.thumbs" :key="thumb" :src="thumb" alt="" class="thumb">
        </div>
        <div class="cartoon-thumbs-container wall">
          <img :src="episodes.info.background" alt="" class="thumb">
          <!-- <img v-for="(thumb) in episodes.info.thumbs" :key="thumb" :src="thumb" alt="" class="thumb"> -->
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
      <h1>문제가 발생했습니다.<br>(성인 웹툰은 현재 지원하지 않습니다.)</h1>
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
  asyncData ({ route, req }) {
    const apiHost = req ? req.headers.host.split(':')[0] : location.hostname

    return axios
      .get(`http://${apiHost}:4100/api/episodes`, {
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
        return {
          episodes: {
            error: true
          }
        }
      })
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

.cartoon-specific {
  .cartoon-info {
    padding: 0 space(3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    background-color: rgba(#fff, 0.4);

    .cartoon-thumbs-container {
      position: relative;
      display: inline-block;
      width: 20rem;
      max-width: 90%;

      &.wall {
        position: fixed;
        width: 100%;
        height: calc(100vh + 5rem);
        max-width: none;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        filter: saturate(1.7);
        opacity: 0.8;
        z-index: -1;

        .thumb {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
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
      padding: 0 space(3);
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
      background-color: rgba(#fff, 0.5);
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
          font-size: body(4);
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
