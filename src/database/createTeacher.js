
module.exports = async (db, { teacherValue, classValue, classScheduleValues }) => {
    
    // Inserir dados na tabela teachers
    const { name, avatar, whatsapp, bio } = teacherValue
    const insertedTeacher = await db.run(`
        INSERT INTO teachers (
            name,
            avatar,
            whatsapp,
            bio
        ) VALUES (
            ${name}, 
            ${avatar}, 
            ${whatsapp}, 
            ${bio}
        );
    `)
    
    // Inserir dados na tabela Classes
    const { subject, cost } = classValue
    const teacher_id = insertedTeacher.lastID
    const insertedClass = await db.run(`
        INSERT INTO classes (
            subject,
            cost,
            teacher_id
        ) VALUES (
            ${subject},
            ${cost},
            ${teacher_id}
        );
    `)

    // Inserir dados na tabela class_schedule
    const class_id = insertedClass.lastID
    const insertAllClassScheduleValues = classScheduleValues.map( value => {
        const { weekday, time_from, time_to } = value

        return db.run(`
            INSERT INTO class_schedule (
                class_id,
                weekday,
                time_from,
                time_to
            ) VALUES (
                ${class_id},
                ${weekday},
                ${time_from},
                ${time_to}
            );
        `)
    })

    // iremos inserir em massa, um array de vários horários
    await Promise.all(insertAllClassScheduleValues)
}