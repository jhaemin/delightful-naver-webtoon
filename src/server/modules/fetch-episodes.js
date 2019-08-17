const fs = require('fs')
const rp = require('request-promise')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const queryString = require('query-string')
const Jimp = require('jimp')

/**
 * 성인 웹툰의 경우 로그인 창이 떠서 에러
 */

module.exports = async function (cartoonId, pageNumber) {
  // return new Promise((resolve, reject) => {
  // function rejectPromise () {
  //   reject(new Error('Wrong dom structure. Website may be got updated.'))
  // }

  const episodes = {
    info: {
      title: '',
      authors: [],
      score: 0,
      thumbs: [],
      background: ''
    },
    list: []
  }

  let url =
    'https://m.comic.naver.com/webtoon/list.nhn' + '?titleId=' + cartoonId

  if (pageNumber) {
    url += '&page' + pageNumber
  }

  const errObj = {
    error: true
  }

  const html = await rp(url)
  const dom = new JSDOM(html)
  const doc = dom.window.document
  const episodeListCandidates = dom.window.document.querySelectorAll(
    '.section_episode_list'
  )
  if (!episodeListCandidates) {
    return errObj
  }
  const episodeList = episodeListCandidates[episodeListCandidates.length - 1]

  // Validate area
  const areaInfo = doc.querySelector('.area_info')
  if (!areaInfo) {
    return errObj
  }

  // Title
  if (!areaInfo.querySelector('.title')) {
    return errObj
  }
  episodes.info.title = areaInfo.querySelector('.title').textContent

  // Author
  if (!areaInfo.querySelector('.author')) {
    return errObj
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

  // Cartoon thumbs
  const areaThumbnail = doc.querySelector('.area_thumbnail')
  if (areaThumbnail) {
    areaThumbnail.querySelectorAll('img').forEach((thumbElm) => {
      episodes.info.thumbs.push(thumbElm.src)
    })
  }

  // await rp(episodes.info.thumbs[0], {
  //   headers: {
  //     referer: 'https://www.naver.com'
  //   }
  // }).pipe(fs.createWriteStream('test1.png'))

  let thumb1 = null

  try {
    thumb1 = await Jimp.read({
      url: episodes.info.thumbs[episodes.info.thumbs.length - 1],
      headers: {
        referer: 'https://www.naver.com'
      }
    })

    const ratio = thumb1.getHeight() / thumb1.getWidth()
    const newWidth = 30
    thumb1.resize(newWidth, newWidth * ratio)
    thumb1.gaussian(5)
    thumb1.getBase64(Jimp.AUTO, function (err, img64) {
      if (err) {
        console.error(err)
      }

      episodes.info.background = img64
    })
  } catch (error) {
    console.error(error)
  }

  const items = episodeList.querySelectorAll('li')
  if (!items) {
    return errObj
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

    // Episode title
    if (!item.querySelector('.title .name')) {
      return errObj
    }
    epi.title = item.querySelector('.title .name').textContent.trim()

    // Episode upload date
    if (!item.querySelector('.date')) {
      return errObj
    }
    epi.date = item.querySelector('.date').textContent.trim()

    // Episode score
    if (!item.querySelector('.score')) {
      return errObj
    }
    epi.score = Number(item.querySelector('.score').textContent.trim())

    // Episode image
    if (!item.querySelector('.thumbnail img')) {
      return errObj
    }
    epi.thumbSrc = item.querySelector('.thumbnail img').src.trim()

    // Episode link
    if (!item.querySelector('.link')) {
      return errObj
    }
    epi.link = item.querySelector('.link').href.trim()

    // Episode number
    const parsed = queryString.parse(epi.link.split('?')[1])
    const epiId = Number(parsed.no)
    epi.id = epiId

    episodes.list.push(epi)
  }

  return episodes
}
