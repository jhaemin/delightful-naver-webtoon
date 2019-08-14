const express = require('express')
const router = express.Router()

router.get('/api/daily-list', async (req, response) => {
  const fetchDailyList = require('./modules/fetch-daily-list.js')

  let cartoons = await fetchDailyList(req.query.day)
  response.json(cartoons)
})

// Fetch episodes
router.get('/api/episodes', async (req, response) => {
  const fetchEpisodes = require('./modules/fetch-episodes.js')

  let episodes = await fetchEpisodes(req.query.cartoonId)
  response.json(episodes)
})

module.exports = router
