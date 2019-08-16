const fs = require('fs')
const request = require('request')

let url = 'https://www.google.com/images/srpr/logo3w.png'
// url =
// 'https://image-comic.pstatic.net/webtoon/703846/thumbnail/title_desc_20190425101600_back.png'
url =
  'https://image-comic.pstatic.net/webtoon/710639/thumbnail/title_desc_20190531_front.png'

request(url, {
  headers: {
    referer: 'https://www.naver.com'
  }
}).pipe(fs.createWriteStream('test.png'))
