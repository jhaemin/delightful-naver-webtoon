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
      let toonList = dom.window.document.querySelector('.list_toon')

      if (!toonList) {
        console.error('Wrong dom structure. Website may be got updated.')

        resolve(cartoons)
      }

      let toonItems = toonList.querySelectorAll('.item:not(.banner)')
      for (let i = 0; i < toonItems.length; i++) {
        let item = toonItems[i]
        // Create a webtoon object
        let cartoon = {
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
        cartoon.title = item.querySelector('.title').textContent

        let authorDom
        try {
          // push author name to array
          authorDom = item.querySelector('.author') // author element
          cartoon.authors.push(authorDom.firstChild.textContent)
        } catch (error) {
          console.error(error)
        }

        try {
          // if there exists multi author
          if (authorDom.querySelector('.multi_author')) {
            cartoon.authors.push(
              authorDom.querySelector('.multi_author').textContent
            )
          }
        } catch (error) {
          console.error(error)
        }

        // check details
        let detailsDom = item.querySelector('.detail')
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
        cartoon.link = item.querySelector('a').href

        // get thumbnail image source
        cartoon.thumbSrc = item.querySelector('img').src

        // get webtoon id
        let parsedData = queryString.parse(cartoon.link.split('?')[1])
        cartoon.id = Number(parsedData['titleId'])

        cartoons.push(cartoon)
      }

      resolve(cartoons)
    })
  })
}
