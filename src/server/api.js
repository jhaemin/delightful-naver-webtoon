const express = require('express')
const router = express.Router()

router.get('/api/daily-list', (req, response) => {
  const fetchDailyList = require('./modules/fetch-daily-list.js')
  fetchDailyList(req.query.day).then(cartoons => {
    response.json(cartoons)
  })
})

router.get('/api/episodes', (req, response) => {
  const fetchEpisodes = require('./modules/fetch-episodes.js')
  fetchEpisodes(req.query.cartoonId).then(episodes => {
    response.json(episodes)
  })
})

module.exports = router
