module.exports = function(selectedDay) {
  return new Promise((resolve, reject) => {
    const request = require('request')
    const jsdom = require('jsdom')
    const { JSDOM } = jsdom
    const queryString = require('query-string')

    let cartoons = []

    let url =
      'https://m.comic.naver.com/webtoon/weekday.nhn' + '?week=' + selectedDay

    request(url, (err, res, body) => {
      const dom = new JSDOM(body)
      let toonList
      try {
        toonList = dom.window.document.querySelector('.list_toon')

        if (!toonList) {
          throw new Error('Wrong dom structure. Website may be got updated.')
        }
      } catch (error) {
        console.error(error)
      }

      let toonItems = toonList.querySelectorAll('.item:not(.banner)')
      for (let i = 0; i < toonItems.length; i++) {
        let item = toonItems[i]
        let webtoon = {
          id: 0,
          title: '',
          authors: [],
          details: {
            new: false,
            update: false,
            cut: false,
            break: false,
            shortAni: false
          },
          thumbSrc: '',
          link: ''
        }

        try {
          // get title
          webtoon.title = item.querySelector('.title').textContent
        } catch (error) {
          console.error(error)
        }

        let authorDom
        try {
          // push author name to array
          authorDom = item.querySelector('.author') // author element
          webtoon.authors.push(authorDom.firstChild.textContent)
        } catch (error) {
          console.error(error)
        }

        try {
          // if there exists multi author
          if (authorDom.querySelector('.multi_author')) {
            webtoon.authors.push(
              authorDom.querySelector('.multi_author').textContent
            )
          }
        } catch (error) {
          console.error(error)
        }

        // check details
        let detailsDom = item.querySelector('.detail')
        if (detailsDom.querySelector('.bullet.up')) {
          webtoon.details.update = true
        }
        if (detailsDom.querySelector('.bullet.new')) {
          webtoon.details.new = true
        }
        if (detailsDom.querySelector('.bullet.cut')) {
          webtoon.details.cut = true
        }
        if (detailsDom.querySelector('.bullet.short_ani')) {
          webtoon.details.shortAni = true
        }
        if (detailsDom.querySelector('.bullet.break')) {
          webtoon.details.break = true
        }

        // get link
        webtoon.link = item.querySelector('a').href

        // get thumbnail image source
        webtoon.thumbSrc = item.querySelector('img').src

        // get webtoon id
        let parsedData = queryString.parse(webtoon.link.split('?')[1])
        webtoon.id = Number(parsedData['titleId'])

        cartoons.push(webtoon)
      }

      resolve(cartoons)
    })
  })
}
