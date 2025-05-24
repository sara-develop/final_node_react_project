// const WeeklySchedule = require('../models/weeklySchedule');
// const Lesson = require('../models/lesson');

// const createSchedule = async (req, res) => {
//     const { classNumber, lessonsPerDay } = req.body;
//     if (!classNumber || !lessonsPerDay) {
//         return res.status(400).json({ message: 'classNumber and lessonsPerDay are required' });
//     }
//     const scheduleData = { classNumber };
//     for (const [day, count] of Object.entries(lessonsPerDay)) {
//         scheduleData[day] = { lessons: Array(count).fill(null) };
//     }
//     try {
//         const schedule = await WeeklySchedule.create(scheduleData);
//         return res.status(201).json(schedule);
//     } catch (err) {
//         return res.status(500).json({ message: 'Failed to create schedule', error: err });
//     }
// };

// const getScheduleByClassNumber = async (req, res) => {
//     const { classNumber } = req.params;
//     try {
//         const schedule = await WeeklySchedule.findOne({ classNumber })
//             .populate('sunday.lessons')
//             .populate('monday.lessons')
//             .populate('tuesday.lessons')
//             .populate('wednesday.lessons')
//             .populate('thursday.lessons');

//         console.log('Fetched schedule:', schedule); // לוג לנתונים שנשלפים

//         if (!schedule) {
//             return res.status(404).json({ message: 'Schedule not found' });
//         }
//         res.status(200).json(schedule);
//     } catch (err) {
//         console.error('Error fetching schedule:', err);
//         return res.status(500).json({ message: 'Failed to get schedule', error: err });
//     }
// };

// const getSchedule = async (req, res) => {
//     const { classNumber } = req.query;

//     if (!classNumber) {
//         return res.status(400).json({ message: 'Class number is required' });
//     }

//     try {
//         const schedule = await WeeklySchedule.findOne({ classNumber })
//             .populate('sunday.lessons')
//             .populate('monday.lessons')
//             .populate('tuesday.lessons')
//             .populate('wednesday.lessons')
//             .populate('thursday.lessons');

//         if (!schedule) {
//             return res.status(404).json({ message: 'Schedule not found' });
//         }

//         return res.status(200).json(schedule);
//     } catch (err) {
//         return res.status(500).json({ message: 'Failed to get schedule', error: err });
//     }
// };
// // POST /api/schedule/updateLessonsAmount
// const updateLessonsAmount = async (req, res) => {
//     const { classNumber, lessonsPerDay } = req.body;
//     console.log('updateLessonsAmount called', classNumber, lessonsPerDay);
//     if (!classNumber || !lessonsPerDay) {
//         return res.status(400).json({ message: 'classNumber and lessonsPerDay are required' });
//     }
//     try {
//         const schedule = await WeeklySchedule.findOne({ classNumber });
//         if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

//         // לוג לבדיקה
//         console.log('updateLessonsAmount called', classNumber, lessonsPerDay);

//         for (const [day, count] of Object.entries(lessonsPerDay)) {
//             schedule[day].lessons = Array(count).fill(null);
//         }

//         await schedule.save();
//         const updated = await WeeklySchedule.findOne({ classNumber });
//         res.status(200).json(updated);
//     } catch (err) {
//         res.status(500).json({ message: 'Failed to update lessons amount', error: err });
//     }
// };

// const oneDaySchedule = async (req, res) => {
//     const { classNumber, day } = req.query;

//     if (!classNumber || !day) {
//         return res.status(400).json({ message: 'Class number and day are required' });
//     }

//     try {
//         const schedule = await WeeklySchedule.findOne({ classNumber }).populate(`${day}.lessons`);
//         if (!schedule) {
//             return res.status(404).json({ message: 'Schedule not found' });
//         }

//         return res.status(200).json(schedule[day]);
//     } catch (err) {
//         return res.status(500).json({ message: 'Failed to get day schedule', error: err });
//     }
// };

// const updateSchedule = async (req, res) => {
//     const { classNumber, scheduleUpdates } = req.body;

//     if (!classNumber || !scheduleUpdates) {
//         return res.status(400).json({ message: 'Class number and updates are required' });
//     }

//     try {
//         const schedule = await WeeklySchedule.findOne({ classNumber });
//         if (!schedule) {
//             return res.status(404).json({ message: 'Schedule not found' });
//         }

//         console.log('Before update:', schedule); // לוג לפני העדכון

//         Object.entries(scheduleUpdates).forEach(([day, data]) => {
//             if (schedule[day]) {
//                 schedule[day].lessons = data.lessons;
//             }
//         });

//         await schedule.save();

//         console.log('After update:', schedule); // לוג אחרי העדכון

//         return res.status(200).json({ message: 'Schedule updated' });
//     } catch (err) {
//         console.error('Update schedule error:', err); // הוסיפי שורה זו
//         return res.status(500).json({ message: 'Update failed', error: err });
//     }
// };

// const updateOneDaySchedule = async (req, res) => {
//     const { classNumber, day, lessons } = req.body;

//     if (!classNumber || !day || !lessons) {
//         return res.status(400).json({ message: 'Class number, day and lessons are required' });
//     }

//     try {
//         const schedule = await WeeklySchedule.findOne({ classNumber });
//         if (!schedule) {
//             return res.status(404).json({ message: 'Schedule not found' });
//         }

//         schedule[day].lessons = lessons;
//         await schedule.save();
//         return res.status(200).json({ message: 'Day schedule updated' });
//     } catch (err) {
//         return res.status(500).json({ message: 'Update failed', error: err });
//     }
// };

// const updateLessonInSchedule = async (req, res) => {
//     const { classNumber, day, lessonIndex, lessonId } = req.body;

//     if (!classNumber || !day || lessonIndex === undefined || !lessonId) {
//         return res.status(400).json({ message: 'classNumber, day, lessonIndex, and lessonId are required' });
//     }

//     try {
//         const weeklySchedule = await WeeklySchedule.findOne({ classNumber });
//         if (!weeklySchedule) {
//             return res.status(404).json({ message: 'Schedule not found' });
//         }

//         // ודא שיש מערך שיעורים ליום הזה
//         if (!weeklySchedule[day] || !Array.isArray(weeklySchedule[day].lessons)) {
//             weeklySchedule[day] = { lessons: [] };
//         }

//         // הרחב את המערך אם צריך
//         while (weeklySchedule[day].lessons.length <= lessonIndex) {
//             weeklySchedule[day].lessons.push(null);
//         }

//         // עדכן את השיעור במקום הנכון
//         weeklySchedule[day].lessons[lessonIndex] = lessonId;

//         await weeklySchedule.save();
//         res.status(200).json({ message: 'Lesson updated in schedule' });
//     } catch (err) {
//         console.error('Update single lesson error:', err);
//         res.status(500).json({ message: 'Update failed', error: err });
//     }
// };

// const deleteSchedule = async (req, res) => {
//     const { classNumber } = req.body;

//     if (!classNumber) {
//         return res.status(400).json({ message: 'Class number is required' });
//     }

//     try {
//         const result = await WeeklySchedule.deleteOne({ classNumber });
//         if (result.deletedCount === 0) {
//             return res.status(404).json({ message: 'Schedule not found' });
//         }
//         return res.status(200).json({ message: 'Schedule deleted' });
//     } catch (err) {
//         return res.status(500).json({ message: 'Deletion failed', error: err });
//     }
// };

// const shortenDay = async (req, res) => {
//     const { classNumber, day, lessonIndex } = req.body;

//     if (!classNumber || !day || lessonIndex === undefined) {
//         return res.status(400).json({ message: 'classNumber, day, and lessonIndex are required' });
//     }

//     try {
//         const weeklySchedule = await WeeklySchedule.findOne({ classNumber });
//         if (!weeklySchedule) {
//             return res.status(404).json({ message: 'Schedule not found' });
//         }

//         if (!weeklySchedule[day] || !Array.isArray(weeklySchedule[day].lessons)) {
//             return res.status(400).json({ message: 'Day not found or invalid' });
//         }

//         // מחיקת השיעור והזזת כל השיעורים שאחריו
//         weeklySchedule[day].lessons.splice(lessonIndex, 1);

//         // אופציונלי: להוסיף null בסוף כדי לשמור על אורך קבוע
//         weeklySchedule[day].lessons.push(null);

//         await weeklySchedule.save();
//         res.status(200).json({ message: 'Lesson removed and day shortened' });
//     } catch (err) {
//         console.error('Shorten day error:', err);
//         res.status(500).json({ message: 'Shorten day failed', error: err });
//     }
// };

// module.exports = { createSchedule, getSchedule, oneDaySchedule, updateSchedule, updateOneDaySchedule, updateLessonInSchedule, deleteSchedule, getScheduleByClassNumber, shortenDay, updateLessonsAmount };


const WeeklySchedule = require('../models/weeklySchedule');
const Lesson = require('../models/lesson');

const createSchedule = async (req, res) => {
    const { classNumber } = req.body;

    if (!classNumber) {
        return res.status(400).json({ message: 'Class number is required' });
    }

    try {
        const schedule = await WeeklySchedule.create({ classNumber });
        return res.status(201).json(schedule);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create schedule', error: err });
    }
};

const getScheduleByClassNumber = async (req, res) => {
    const { classNumber } = req.params;
    try {
        const schedule = await WeeklySchedule.findOne({ classNumber })
            .populate('sunday.lessons')
            .populate('monday.lessons')
            .populate('tuesday.lessons')
            .populate('wednesday.lessons')
            .populate('thursday.lessons');

        console.log('Fetched schedule:', schedule); // לוג לנתונים שנשלפים

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (err) {
        console.error('Error fetching schedule:', err);
        return res.status(500).json({ message: 'Failed to get schedule', error: err });
    }
};

const getSchedule = async (req, res) => {
    const { classNumber } = req.query;

    if (!classNumber) {
        return res.status(400).json({ message: 'Class number is required' });
    }

    try {
        const schedule = await WeeklySchedule.findOne({ classNumber })
            .populate('sunday.lessons')
            .populate('monday.lessons')
            .populate('tuesday.lessons')
            .populate('wednesday.lessons')
            .populate('thursday.lessons');

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        return res.status(200).json(schedule);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to get schedule', error: err });
    }
};

const oneDaySchedule = async (req, res) => {
    const { classNumber, day } = req.query;

    if (!classNumber || !day) {
        return res.status(400).json({ message: 'Class number and day are required' });
    }

    try {
        const schedule = await WeeklySchedule.findOne({ classNumber }).populate(`${day}.lessons`);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        return res.status(200).json(schedule[day]);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to get day schedule', error: err });
    }
};

const updateSchedule = async (req, res) => {
    const { classNumber, scheduleUpdates } = req.body;

    if (!classNumber || !scheduleUpdates) {
        return res.status(400).json({ message: 'Class number and updates are required' });
    }

    try {
        const schedule = await WeeklySchedule.findOne({ classNumber });
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        console.log('Before update:', schedule); // לוג לפני העדכון

        Object.entries(scheduleUpdates).forEach(([day, data]) => {
            if (schedule[day]) {
                schedule[day].lessons = data.lessons;
            }
        });

        await schedule.save();

        console.log('After update:', schedule); // לוג אחרי העדכון

        return res.status(200).json({ message: 'Schedule updated' });
    } catch (err) {
        console.error('Update schedule error:', err); // הוסיפי שורה זו
        return res.status(500).json({ message: 'Update failed', error: err });
    }
};

const updateOneDaySchedule = async (req, res) => {
    const { classNumber, day, lessons } = req.body;

    if (!classNumber || !day || !lessons) {
        return res.status(400).json({ message: 'Class number, day and lessons are required' });
    }

    try {
        const schedule = await WeeklySchedule.findOne({ classNumber });
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        schedule[day].lessons = lessons;
        await schedule.save();
        return res.status(200).json({ message: 'Day schedule updated' });
    } catch (err) {
        return res.status(500).json({ message: 'Update failed', error: err });
    }
};

const updateLessonInSchedule = async (req, res) => {
    const { classNumber, day, lessonIndex, lessonId } = req.body;

    if (!classNumber || !day || lessonIndex === undefined || !lessonId) {
        return res.status(400).json({ message: 'classNumber, day, lessonIndex, and lessonId are required' });
    }

    try {
        const weeklySchedule = await WeeklySchedule.findOne({ classNumber });
        if (!weeklySchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // ודא שיש מערך שיעורים ליום הזה
        if (!weeklySchedule[day] || !Array.isArray(weeklySchedule[day].lessons)) {
            weeklySchedule[day] = { lessons: [] };
        }

        // הרחב את המערך אם צריך
        while (weeklySchedule[day].lessons.length <= lessonIndex) {
            weeklySchedule[day].lessons.push(null);
        }

        // עדכן את השיעור במקום הנכון
        weeklySchedule[day].lessons[lessonIndex] = lessonId;

        await weeklySchedule.save();
        res.status(200).json({ message: 'Lesson updated in schedule' });
    } catch (err) {
        console.error('Update single lesson error:', err);
        res.status(500).json({ message: 'Update failed', error: err });
    }
};

const deleteSchedule = async (req, res) => {
    const { classNumber } = req.body;

    if (!classNumber) {
        return res.status(400).json({ message: 'Class number is required' });
    }

    try {
        const result = await WeeklySchedule.deleteOne({ classNumber });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        return res.status(200).json({ message: 'Schedule deleted' });
    } catch (err) {
        return res.status(500).json({ message: 'Deletion failed', error: err });
    }
};

module.exports = { createSchedule, getSchedule, oneDaySchedule, updateSchedule, updateOneDaySchedule, updateLessonInSchedule, deleteSchedule, getScheduleByClassNumber };