/**
 * 성인 웹툰의 경우 로그인 창이 떠서 에러
 */

module.exports = function(cartoonId, pageNumber) {
  return new Promise((resolve, reject) => {
    const request = require('request')
    const jsdom = require('jsdom')
    const { JSDOM } = jsdom
    const queryString = require('query-string')

    let episodes = {
      info: {
        title: '',
        author: [],
        score: 0
      },
      list: []
    }

    let url =
      'https://m.comic.naver.com/webtoon/list.nhn' + '?titleId=' + cartoonId

    if (pageNumber) {
      url += '&page' + pageNumber
    }

    request(url, (err, res, body) => {
      const dom = new JSDOM(body)

      let episodeList
      try {
        episodeList = dom.window.document.querySelectorAll(
          '.section_episode_list'
        )
        episodeList = episodeList[episodeList.length - 1]

        if (!episodeList) {
          throw new Error('Wrong dom structure. Website may be got updated.')
        }
      } catch (error) {
        console.error(error)
      }

      // Get title
      let areaInfo = dom.window.document.querySelector('.area_info')
      episodes.info.title = areaInfo.querySelector('.title').textContent
      episodes.info.author.push(
        areaInfo.querySelector('.author').firstChild.textContent
      )
      if (areaInfo.querySelector('.author .multi_author')) {
        episodes.info.author.push(
          areaInfo.querySelector('.author .multi_author').textContent
        )
      }

      let items = episodeList.querySelectorAll('li')

      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        let epi = {
          title: '',
          date: '',
          score: 0,
          thumbSrc: '',
          link: '',
          id: 0
        }

        try {
          epi.title = item.querySelector('.title .name').textContent.trim()
        } catch (error) {
          console.error(error)
        }
        try {
          epi.date = item.querySelector('.date').textContent.trim()
        } catch (error) {
          console.error(error)
        }
        try {
          epi.score = Number(item.querySelector('.score').textContent.trim())
        } catch (error) {
          console.error(error)
        }
        try {
          epi.thumbSrc = item.querySelector('.thumbnail img').src.trim()
        } catch (error) {
          console.error(error)
        }
        try {
          epi.link = item.querySelector('.link').href.trim()
        } catch (error) {
          console.error(error)
        }

        let parsed = queryString.parse(epi.link.split('?')[1])
        let epiId = Number(parsed['no'])

        epi.id = epiId

        episodes.list.push(epi)
      }

      resolve(episodes)
    })
  })
}
