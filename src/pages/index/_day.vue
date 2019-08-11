<template>
  <div class="daily-list">
    <div class="day-select">
      <a class="day-link" v-for="i in 7" :key="i" :href="`/${dayToString(i - 1)}`">
        <button
          class="day-btn"
          :class="{ selected: dayToString(i - 1) === today }"
        >{{ dayToString(i - 1, 'kr') }}</button>
      </a>
    </div>
    <div class="cartoon-item-container">
      <div class="cartoon-item-wrapper" v-for="item in dailyList" :key="item.id">
        <NuxtLink :to="String(item.id)" class="cartoon-link">
          <div class="cartoon-item">
            <div class="thumb-wrapper">
              <img class="thumb" :src="item.thumbSrc" :alt="item.title" />
            </div>
            <div class="info">
              <h1 class="title">{{ item.title }}</h1>
              <h2 class="authors">{{ item.authors.join(' · ') }}</h2>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import dayToString from '~/plugins/day-to-string.js'

export default {
  middleware({ redirect, route }) {
    if (!route.params.day) {
      return redirect(`/${dayToString(dayjs().day())}`)
    }
  },
  asyncData({ route }) {
    return axios
      .get('http://localhost:3000/api/daily-list', {
        params: {
          day: route.params.day
        }
      })
      .then(response => {
        return {
          dailyList: response.data,
          today: route.params.day
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    dayToString(dayIndex, lang) {
      return dayToString(dayIndex, lang)
    }
  }
}
</script>

<style lang="scss">
$cartoon-gap: 0.5rem;

.daily-list {
  padding: 0 1rem - $cartoon-gap;
  max-width: 60rem;
  margin: auto;

  .day-select {
    display: flex;
    overflow: hidden;
    max-width: 25rem;
    margin: auto;
    position: sticky;
    top: 1rem;
    background-color: #fff;
    z-index: 9999;
    padding: 0 0.7rem;
    height: 2.3rem;
    border-radius: 0 0 0.7rem 0.7rem;
    border-radius: 0.7rem;
    box-shadow: 0 1.5rem 5rem rgba(#000, 0.4);

    .day-link {
      display: flex;
      flex: 1;
      align-self: stretch;

      .day-btn {
        color: #6b6b6b;
        cursor: pointer;
        width: 100%;
        font-size: 0.8rem;
        font-weight: 400;
        border: none;
        background: none;

        &.selected {
          background-color: #f5f6fa;
          font-weight: 600;
          color: #424242;
        }
      }
    }
  }

  .cartoon-item-container {
    padding-top: 3rem;

    .cartoon-item-wrapper {
      padding-bottom: 1rem;
      display: inline-block;
      width: calc(#{100% * 1 / 6} - #{$cartoon-gap * 2});
      vertical-align: top;
      margin: 0 $cartoon-gap;

      @media only screen and (max-width: 1000px) {
        width: calc(#{100% * 1 / 5} - #{$cartoon-gap * 2});
      }

      @media only screen and (max-width: 770px) {
        width: calc(#{100% * 1 / 4} - #{$cartoon-gap * 2});
      }

      @media only screen and (max-width: 650px) {
        width: calc(#{100% * 1 / 3} - #{$cartoon-gap * 2});
      }

      @media only screen and (max-width: 500px) {
        $cartoon-gap: 0.2rem;
        width: calc(#{100% * 1 / 3} - #{$cartoon-gap * 2});
        margin: 0 $cartoon-gap;
      }

      .cartoon-link {
        .cartoon-item {
          background-color: #f5f6fa;
          border-radius: 0.7rem;
          padding: 0.5rem;
          padding-bottom: 0.7rem;
          overflow: hidden;

          .thumb-wrapper {
            width: 100%;
            position: relative;

            &::before {
              padding-top: 100%;
            }

            .thumb {
              width: 100%;
              height: 100%;
              border-radius: 0.6rem;
              overflow: hidden;
              box-shadow: 0 0.2rem 0.5rem rgba(#000, 0.2);
            }
          }

          .info {
            padding: 0 0.3rem;

            .title {
              font-size: 0.7rem;
              font-weight: 700;
              margin-top: 0.5rem;
            }

            .authors {
              margin-top: 0.1rem;
              font-size: 0.6rem;
              font-weight: 400;
              color: #808080;
            }
          }
        }
      }
    }
  }
}
</style>