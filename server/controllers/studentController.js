const Student = require("../models/student");
const WeeklySchedule = require("../models/weeklySchedule"); 
const { isValidId } = require("../utils")
const { sendWeeklyAttendanceEmails } = require("../utils");

const addStudent = async (req, res) => {
    const { name, idNumber, parentEmail, classNumber } = req.body

    if (!name || !idNumber || !parentEmail || !classNumber) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!isValidId(idNumber)) {
        return res.status(400).json({ message: 'Invalid ID number format' })
    }

    const duplicate = await Student.findOne({ idNumber }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Student with this ID already exists" })
    }

    try {
        const student = await Student.create({ name, idNumber, parentEmail, classNumber })
        res.status(201).json(student)
    } catch (error) {
        res.status(500).json({ message: 'Failed to create student', error })
    }
}

const getAllClasses = async (req, res) => {
    try {
        // שליפת מספרי הכיתות מתוך אוסף התלמידות
        const students = await Student.find({}, 'classNumber');
        const classNumbers = [...new Set(students.map(student => student.classNumber))];

        // יצירת מערכת שעות ריקה לכל כיתה שאין לה עדיין
        for (const classNumber of classNumbers) {
            const exists = await WeeklySchedule.findOne({ classNumber });
            if (!exists) {
                await WeeklySchedule.create({
                    classNumber,
                    sunday: { lessons: [] },
                    monday: { lessons: [] },
                    tuesday: { lessons: [] },
                    wednesday: { lessons: [] },
                    thursday: { lessons: [] }
                });
            }
        }

        console.log('Class numbers fetched from students:', classNumbers);
        res.json(classNumbers);
    } catch (error) {
        console.error('Error fetching class numbers from students:', error);
        res.status(500).json({ error: 'Failed to fetch class numbers' });
    }
    console.log('getAllClasses endpoint hit');
};

const getById = async (req, res) => {
    const { id } = req.params

    try {
        const student = await Student.findById(id)
        if (!student) return res.status(404).json({ message: "Student not found" })
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({ message: 'Failed to get student', error })
    }
}

const getAll = async (req, res) => {
    try {
        const students = await Student.find().lean()
        res.status(200).json(students)
    } catch (error) {
        res.status(500).json({ message: 'Failed to get students', error })
    }
}

const updateStudent = async (req, res) => {
    const { id } = req.params
    const { name, idNumber, parentEmail, classNumber } = req.body

    if (!name || !idNumber || !parentEmail || !classNumber) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!isValidId(idNumber)) {
        return res.status(400).json({ message: 'Invalid ID number format' })
    }

    try {
        const student = await Student.findByIdAndUpdate(id, { name, idNumber, parentEmail, classNumber }, { new: true })
        if (!student) return res.status(404).json({ message: "Student not found" })
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({ message: 'Failed to update student', error })
    }
}

const updateActive = async (req, res) => {
    const { id } = req.params

    try {
        const student = await Student.findById(id)
        if (!student) return res.status(404).json({ message: "Student not found" })

        student.active = !student.active
        await student.save()

        res.status(200).json({ message: `Active status changed to ${student.active}`, student })
    } catch (error) {
        res.status(500).json({ message: 'Failed to toggle active status', error })
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params

    try {
        const student = await Student.findByIdAndDelete(id)
        if (!student) return res.status(404).json({ message: "Student not found" })
        res.status(200).json({ message: "Student deleted" })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete student', error })
    }
}

const updateAttendanceForLesson = async (req, res) => {
    const { classNumber, day, lessonId, attendanceUpdates } = req.body;

    if (!classNumber || !day || !lessonId || !attendanceUpdates) {
        return res.status(400).json({ message: "Class number, day, lesson ID, and attendance updates are required" });
    }

    try {
        const students = await Student.find({ classNumber });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found for this class" });
        }

        for (const update of attendanceUpdates) {
            const student = students.find(s => s.idNumber === update.idNumber);
            if (student) {
                // בדוק אם יש נוכחות ליום ולשיעור הספציפי
                const attendanceDay = student.weeklyAttendance[day] || [];
                const lessonIndex = attendanceDay.findIndex(l => l.lessonId.toString() === lessonId);

                if (lessonIndex !== -1) {
                    // עדכן את הסטטוס של השיעור הקיים
                    attendanceDay[lessonIndex].status = update.status;
                } else {
                    // הוסף שיעור חדש עם הסטטוס
                    attendanceDay.push({ lessonId, status: update.status });
                }

                // עדכן את הנוכחות ליום הספציפי
                student.weeklyAttendance[day] = attendanceDay;
                await student.save();
            }
        }

        res.status(200).json({ message: "Attendance updated successfully" });
    } catch (err) {
        console.error("Error updating attendance:", err);
        res.status(500).json({ message: "Failed to update attendance", error: err });
    }
};

const getStudentByClassNumber = async (req, res) => {
    const { classNumber } = req.params;

    if (!classNumber) {
        return res.status(400).json({ message: "Class number is required" });
    }

    try {
        const students = await Student.find({ classNumber });
        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found for this class" });
        }

        res.status(200).json(students);
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ message: "Failed to fetch students", error: err });
    }
};

const getAttendanceByLesson = async (req, res) => {
    const { classNumber, day, lessonId } = req.params;

    if (!classNumber || !day || !lessonId) {
        return res.status(400).json({ message: "Class number, day, and lesson ID are required" });
    }

    try {
        const students = await Student.find({ classNumber });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found for this class" });
        }

        const attendanceData = students.map(student => {
            const attendanceDay = student.weeklyAttendance[day] || [];
            const lesson = attendanceDay.find(l => l.lessonId.toString() === lessonId);
            return {
                idNumber: student.idNumber,
                name: student.name,
                status: lesson ? lesson.status : 'Absent'
            };
        });

        res.status(200).json(attendanceData);
    } catch (err) {
        console.error("Error fetching attendance:", err);
        res.status(500).json({ message: "Failed to fetch attendance", error: err });
    }
};

const sendWeeklyAttendanceEmailsHandler = async (req, res) => {
    try {
        const result = await sendWeeklyAttendanceEmails();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || "Error sending emails" });
    }
};


module.exports = {
    addStudent, getById, getAll, updateStudent, updateActive, deleteById, getAllClasses, updateAttendanceForLesson, getStudentByClassNumber, getAttendanceByLesson, sendWeeklyAttendanceEmailsHandler
}
