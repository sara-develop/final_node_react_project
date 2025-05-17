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

const getAllClasses = async (req, res) => {
    try {
        const schedules = await WeeklySchedule.find({}, 'classNumber');
        const classNumbers = [...new Set(schedules.map(s => s.classNumber))];
        res.json(classNumbers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch class numbers' });
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

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (err) {
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

        Object.entries(scheduleUpdates).forEach(([day, data]) => {
            if (schedule[day]) {
                schedule[day].lessons = data.lessons;
            }
        });

        await schedule.save();
        return res.status(200).json({ message: 'Schedule updated' });
    } catch (err) {
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

module.exports = { createSchedule, getSchedule, getAllClasses,oneDaySchedule, updateSchedule, updateOneDaySchedule, deleteSchedule, getScheduleByClassNumber };
