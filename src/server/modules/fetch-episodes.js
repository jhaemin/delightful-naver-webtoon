module.exports = function(cartoonId, pageNumber) {
  return new Promise((resolve, reject) => {
    const request = require('request')
    const jsdom = require('jsdom')
    const { JSDOM } = jsdom
    const queryString = require('query-string')

    let episodes = []

    let url =
      'https://m.comic.naver.com/webtoon/list.nhn' + '?titleId=' + cartoonId

    if (pageNumber) {
      url += '&page' + pageNumber
    }

    request(url, (err, res, body) => {
      const dom = new JSDOM(body)

      try {
        let episodeList = dom.window.document.querySelectorAll(
          '.section_episode_list'
        )
        episodeList = episodeList[episodeList.length - 1]

        if (!episodeList) {
          throw new Error('Wrong dom structure. Website may be got updated.')
        }
      } catch (error) {
        console.error(error)
      }

      let items = episodeList.querySelectorAll('li')
      console.log(items.length)
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

        episodes.push(epi)
      }

      resolve(episodes)
    })
  })
}
