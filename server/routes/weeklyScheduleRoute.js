// const express = require("express");
// const router = express.Router();
// const verifyJWT = require('../middleware/verifyJWT');
// const WeeklyScheduleController = require("../controllers/weeklyScheduleControlle");

// router.post("/createSchedule", verifyJWT, WeeklyScheduleController.createSchedule);
// router.get("/daySchedule", verifyJWT, WeeklyScheduleController.oneDaySchedule);
// router.get("/getSchedule", verifyJWT, WeeklyScheduleController.getSchedule);
// router.put("/updateSchedule", verifyJWT, WeeklyScheduleController.updateSchedule);
// router.put("/updateOneDaySchedule", verifyJWT, WeeklyScheduleController.updateOneDaySchedule);
// router.delete("/deleteSchedule", verifyJWT, WeeklyScheduleController.deleteSchedule);
// router.get("/getScheduleByClassNumber/:classNumber", verifyJWT, WeeklyScheduleController.getScheduleByClassNumber);
// router.put('/shortenDay', verifyJWT, WeeklyScheduleController.shortenDay);
// router.post('/updateLessonsAmount', verifyJWT, WeeklyScheduleController.updateLessonsAmount);
// // עדכון שיעור מסוים (PUT עם body)
// router.put("/updateLessonInSchedule", verifyJWT, WeeklyScheduleController.updateLessonInSchedule);
// module.exports = router;


const express = require("express");
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const WeeklyScheduleController = require("../controllers/weeklyScheduleControlle");

router.post("/createSchedule", verifyJWT, WeeklyScheduleController.createSchedule);
router.get("/daySchedule", verifyJWT, WeeklyScheduleController.oneDaySchedule);
router.get("/getSchedule", verifyJWT, WeeklyScheduleController.getSchedule);
router.put("/updateSchedule", verifyJWT, WeeklyScheduleController.updateSchedule);
router.put("/updateOneDaySchedule", verifyJWT, WeeklyScheduleController.updateOneDaySchedule);
router.delete("/deleteSchedule", verifyJWT, WeeklyScheduleController.deleteSchedule);
router.get("/getScheduleByClassNumber/:classNumber", verifyJWT, WeeklyScheduleController.getScheduleByClassNumber);
// עדכון שיעור מסוים (PUT עם body)
router.put("/updateLessonInSchedule", verifyJWT, WeeklyScheduleController.updateLessonInSchedule);
module.exports = router;
