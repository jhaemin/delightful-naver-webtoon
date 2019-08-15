<template>
  <div class="daily-list">
    <div class="today-info">
      <h2 class="today-date">
        {{ todayStr }}
      </h2>
      <h1 class="weekday">
        {{ dayToKr(today) }}요일
      </h1>
    </div>
    <div class="day-select">
      <a v-for="i in 7" :key="i" class="day-link" :href="`/${dayToString(i - 1)}`">
        <button
          class="day-btn"
          :class="{ selected: dayToString(i - 1) === today }"
        >{{ dayToString(i - 1, 'kr') }}</button>
      </a>
    </div>
    <div class="cartoon-item-container">
      <div v-for="item in dailyList" :key="item.id" class="cartoon-item-wrapper">
        <NuxtLink :to="'/cartoon/' + String(item.id)" class="cartoon-link">
          <div class="cartoon-item">
            <div class="thumb-wrapper">
              <img class="thumb" :src="item.thumbSrc" :alt="item.title">
            </div>
            <div class="info">
              <h1 class="title">
                {{ item.title }}
              </h1>
              <h2 class="authors">
                {{ item.authors.join(' · ') }}
              </h2>
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
import dayToString from '~/plugins/day-to-string.ts'
import dayToKr from '~/plugins/day-to-kr.ts'

export default {
  middleware ({ redirect, route }) {
    // If there is no param for day
    // redirect to today
    if (!route.params.day) {
      return redirect(`/${dayToString(dayjs().day())}`)
    }
  },
  computed: {
    todayStr () {
      const todayObj = dayjs()
      return `${todayObj.year()}년 ${todayObj.month() +
        1}월 ${todayObj.date()}일`
    }
  },
  asyncData ({ route }) {
    return axios
      .get('http://localhost:3000/api/daily-list', {
        params: {
          day: route.params.day
        }
      })
      .then((response) => {
        return {
          dailyList: response.data,
          today: route.params.day
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
  methods: {
    dayToString (dayIndex, lang) {
      return dayToString(dayIndex, lang)
    },
    dayToKr (dayStr) {
      return dayToKr(dayStr)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/main';

$cartoon-gap: 1rem;

.daily-list {
  max-width: 60rem;
  margin: auto;

  .today-info {
    padding: 2rem 1rem 0.7rem;
    margin-bottom: 0.5rem;
    position: sticky;
    top: -1.3rem;
    z-index: 8888;
    background-color: rgba(#fff, 0.85);
    backdrop-filter: blur(20px) saturate(1.5);

    .today-date {
      font-weight: 400;
      font-size: 0.7rem;
      color: #808080;
      margin-bottom: 0.3rem;
    }

    .weekday {
      font-size: 1.5rem;
      line-height: 1em;
      height: 1em;
    }
  }

  .day-select {
    position: fixed;
    left: 50%;
    bottom: 2.5rem;
    transform: translateX(-50%);
    display: flex;
    overflow: hidden;
    width: calc(100% - 2rem);
    max-width: 25rem;
    background-color: #fff;
    z-index: 9999;
    padding: 0 space(3);
    height: 2.3rem;
    border-radius: radius(4);
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
          background-color: $alice-blue;
          font-weight: 600;
          color: #424242;
        }
      }
    }
  }

  .cartoon-item-container {
    margin: auto;
    padding-bottom: 6rem;
    width: calc(100% - 2rem);

    @media only screen and (max-width: 500px) {
      width: calc(100% - 1rem);
    }

    .cartoon-item-wrapper {
      padding-bottom: $cartoon-gap;
      display: inline-block;
      width: calc(#{100% * 1 / 6} - #{$cartoon-gap});
      vertical-align: top;
      margin-right: $cartoon-gap;

      @media only screen and (min-width: 1001px) {
        $num: 6;
        width: calc((100% - #{$cartoon-gap * ($num - 1)}) / #{$num});

        &:nth-child(#{$num}n) {
          margin-right: 0;
        }
      }

      @media only screen and (min-width: 771px) and (max-width: 1000px) {
        $num: 5;
        width: calc((100% - #{$cartoon-gap * ($num - 1)}) / #{$num});

        &:nth-child(#{$num}n) {
          margin-right: 0;
        }
      }

      @media only screen and (min-width: 651px) and (max-width: 770px) {
        $num: 4;
        width: calc((100% - #{$cartoon-gap * ($num - 1)}) / #{$num});

        &:nth-child(#{$num}n) {
          margin-right: 0;
        }
      }

      @media only screen and (min-width: 501px) and (max-width: 650px) {
        $num: 3;
        width: calc((100% - #{$cartoon-gap * ($num - 1)}) / #{$num});

        &:nth-child(#{$num}n) {
          margin-right: 0;
        }
      }

      @media only screen and (max-width: 500px) {
        $num: 3;
        $cartoon-gap: 0.4rem;
        padding-bottom: $cartoon-gap;
        margin-right: $cartoon-gap;
        width: calc((100% - #{$cartoon-gap * ($num - 1)}) / #{$num});

        &:nth-child(#{$num}n) {
          margin-right: 0;
        }
      }

      .cartoon-link {
        .cartoon-item {
          background-color: $alice-blue;
          border-radius: $radius-4;
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
