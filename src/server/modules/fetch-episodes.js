const request = require('request')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const queryString = require('query-string')

/**
 * 성인 웹툰의 경우 로그인 창이 떠서 에러
 */

module.exports = function (cartoonId, pageNumber) {
  return new Promise((resolve, reject) => {
    function rejectPromise () {
      reject(new Error('Wrong dom structure. Website may be got updated.'))
    }

    const episodes = {
      info: {
        title: '',
        authors: [],
        score: 0,
        thumbs: []
      },
      list: []
    }

    let url =
      'https://m.comic.naver.com/webtoon/list.nhn' + '?titleId=' + cartoonId

    if (pageNumber) {
      url += '&page' + pageNumber
    }

    request(url, (err, res, body) => {
      if (err) {
        console.error(err)
      }

      const dom = new JSDOM(body)

      const episodeListCandidates = dom.window.document.querySelectorAll(
        '.section_episode_list'
      )
      if (!episodeListCandidates) {
        rejectPromise()
        return
      }
      const episodeList =
        episodeListCandidates[episodeListCandidates.length - 1]

      // Validate area
      const areaInfo = dom.window.document.querySelector('.area_info')
      if (!areaInfo) {
        rejectPromise()
        return
      }

      // Title
      if (!areaInfo.querySelector('.title')) {
        rejectPromise()
        return
      }
      episodes.info.title = areaInfo.querySelector('.title').textContent

      // Author
      if (!areaInfo.querySelector('.author')) {
        rejectPromise()
        return
      }
      episodes.info.authors.push(
        areaInfo.querySelector('.author').firstChild.textContent
      )

      // Multi author
      if (areaInfo.querySelector('.author .multi_author')) {
        episodes.info.authors.push(
          areaInfo.querySelector('.author .multi_author').textContent
        )
      }

      // Thumbs
      const areaThumbnail = dom.window.document.querySelector('.area_thumbnail')
      if (areaThumbnail) {
        areaThumbnail.querySelectorAll('img').forEach((thumbElm) => {
          episodes.info.thumbs.push(thumbElm.src)
        })
      }

      const items = episodeList.querySelectorAll('li')
      if (!items) {
        rejectPromise()
        return
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const epi = {
          title: '',
          date: '',
          score: 0,
          thumbSrc: '',
          link: '',
          id: 0
        }

        if (!item.querySelector('.title .name')) {
          rejectPromise()
          return
        }
        epi.title = item.querySelector('.title .name').textContent.trim()

        if (!item.querySelector('.date')) {
          rejectPromise()
          return
        }
        epi.date = item.querySelector('.date').textContent.trim()

        if (!item.querySelector('.score')) {
          rejectPromise()
          return
        }
        epi.score = Number(item.querySelector('.score').textContent.trim())

        if (!item.querySelector('.thumbnail img')) {
          rejectPromise()
          return
        }
        epi.thumbSrc = item.querySelector('.thumbnail img').src.trim()

        if (!item.querySelector('.link')) {
          rejectPromise()
          return
        }
        epi.link = item.querySelector('.link').href.trim()

        const parsed = queryString.parse(epi.link.split('?')[1])
        const epiId = Number(parsed.no)

        epi.id = epiId

        episodes.list.push(epi)
      }

      resolve(episodes)
    })
  })
}
