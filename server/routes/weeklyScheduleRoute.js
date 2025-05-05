const express = require("express")
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const WeeklyScheduleControlle = require("../controllers/weeklyScheduleControlle")

module.exports = router