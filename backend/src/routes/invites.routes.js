const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Invites endpoint',
    data: []
  })
})

module.exports = router
