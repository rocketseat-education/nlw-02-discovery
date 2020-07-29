
module.exports = async (db, { teacherValue = [], classValue = [], classScheduleValues = [] }) => {
    
    // Inserir dados na tabela teachers
    const insertedTeacher = await db.run(`
        INSERT INTO teachers (
            name,
            avatar,
            whatsapp,
            bio
        ) VALUES (?,?,?,?);
    `, teacherValue)
    
    // Inserir dados na tabela Classes
    const insertedClass = await db.run(`
        INSERT INTO classes (
            subject,
            cost,
            teacher_id
        ) VALUES (?,?,?);
    `, [...classValue, insertedTeacher.lastID])

    // Inserir dados na tabela class_schedule
    const insertAllClassScheduleValues = classScheduleValues.map( value => db.run(`
        INSERT INTO class_schedule (
            class_id,
            weekday,
            time_from,
            time_to
        ) VALUES (?,?,?,?);
    `, [insertedClass.lastID, ...value]))

    // iremos inserir em massa, um array de vários horários
    await Promise.all(insertAllClassScheduleValues)
}