const request = require('request')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const queryString = require('query-string')

let cartoons = []

let url = 'https://m.comic.naver.com/webtoon/weekday.nhn'

request(url, (err, res, body) => {
  const dom = new JSDOM(body)
  let toonList = dom.window.document.querySelector('.list_toon')

  if (!toonList) {
    throw new Error('Wrong dom structure. Website may be got updated.')
  }

  let toonItems = toonList.querySelectorAll('.item:not(.banner)')
  toonItems.forEach(item => {
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

    // get title
    webtoon.title = item.querySelector('.title').textContent

    // push author name to array
    let authorDom = item.querySelector('.author') // author element
    webtoon.authors.push(authorDom.firstChild.textContent)

    // if there exists multi author
    if (authorDom.querySelector('.multi_author')) {
      webtoon.authors.push(authorDom.querySelector('.multi_author').textContent)
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
  })

  console.log(cartoons)
})
