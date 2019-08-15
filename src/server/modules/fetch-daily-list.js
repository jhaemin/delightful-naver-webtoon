const request = require('request')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const queryString = require('query-string')

module.exports = function (selectedDay) {
  return new Promise((resolve, reject) => {
    function rejectPromise () {
      reject(new Error('Wrong dom structure. Website may be got updated.'))
    }

    const cartoons = []
    const url =
      'https://m.comic.naver.com/webtoon/weekday.nhn' + '?week=' + selectedDay

    request(url, (err, res, body) => {
      if (err) {
        reject(err)
      }

      const dom = new JSDOM(body)
      const toonList = dom.window.document.querySelector('.list_toon')

      if (!toonList) {
        rejectPromise()
        return
      }

      const toonItems = toonList.querySelectorAll('.item:not(.banner)')
      if (!toonItems) {
        rejectPromise()
        return
      }

      for (let i = 0; i < toonItems.length; i++) {
        const item = toonItems[i]
        // Create a webtoon object
        const cartoon = {
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

        // get title
        if (!item.querySelector('.title')) {
          rejectPromise()
          return
        }
        cartoon.title = item.querySelector('.title').textContent

        // push author name to array
        const authorDom = item.querySelector('.author') // author element
        if (!authorDom) {
          rejectPromise()
          return
        }
        cartoon.authors.push(authorDom.firstChild.textContent)

        // if there exists multi author
        if (authorDom.querySelector('.multi_author')) {
          cartoon.authors.push(
            authorDom.querySelector('.multi_author').textContent
          )
        }

        // check details
        const detailsDom = item.querySelector('.detail')
        if (!detailsDom) {
          rejectPromise()
          return
        }

        if (detailsDom.querySelector('.bullet.up')) {
          cartoon.details.update = true
        }
        if (detailsDom.querySelector('.bullet.new')) {
          cartoon.details.new = true
        }
        if (detailsDom.querySelector('.bullet.cut')) {
          cartoon.details.cut = true
        }
        if (detailsDom.querySelector('.bullet.short_ani')) {
          cartoon.details.shortAni = true
        }
        if (detailsDom.querySelector('.bullet.break')) {
          cartoon.details.break = true
        }

        // get link
        if (!item.querySelector('a')) {
          rejectPromise()
          return
        }
        cartoon.link = item.querySelector('a').href

        // get thumbnail image source
        if (!item.querySelector('img')) {
          rejectPromise()
          return
        }
        cartoon.thumbSrc = item.querySelector('img').src

        // get webtoon id
        const parsedData = queryString.parse(cartoon.link.split('?')[1])
        cartoon.id = Number(parsedData.titleId)

        cartoons.push(cartoon)
      }

      resolve(cartoons)
    })
  })
}
