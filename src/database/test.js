const db = require('./db')


db.then(async(db) => {
    await useDatabase(db)
})

async function useDatabase(db) {
    
    // Inserir dados na tabela teachers
    const insertTeacher = () => {
        const query = `
            INSERT INTO teachers (
                name,
                avatar,
                whatsapp,
                bio
            ) VALUES (?,?,?,?);
        `

        const values = [
            "Mayk Brito",
            "https://avatars2.githubusercontent.com/u/6643122?s=460&u=1e9e1f04b76fb5374e6a041f5e41dce83f3b5d92&v=4",
            "7899887766",
            "Instrutor de Educação Física para iniciantes, minha missão de vida é levar saúde e contribuir para o crescimento de quem se interessar. Comecei a minha jornada profissional em 2001, quando meu pai me deu dois alteres de 32kg com a seguinte condição: \"Aprenda a fazer dinheiro com isso!\""
        ]

        return db.run(query, values)
    }

    const insertedTeacher = await insertTeacher()
    
    // Inserir dados na tabela Classes
    const insertClass = (teacher_id) => {
        const query = `
            INSERT INTO classes (
                subject,
                cost,
                teacher_id
            ) VALUES (?,?,?);
        `

        const values = [
            '1',
            '100',
            teacher_id
        ]

        return db.run(query, values)
    }

    const insertedClass = await insertClass(insertedTeacher.lastID)

    // Inserir dados na tabela class_schedule
    const insertClassSchedule = (values) => {
        const query = `
            INSERT INTO class_schedule (
                class_id,
                weekday,
                time_from,
                time_to
            ) VALUES (?,?,?,?);
        `
        return db.run(query, values)
    }

    await insertClassSchedule([insertedClass.lastID,1,720,1220])
    await insertClassSchedule([insertedClass.lastID,2,820,920])
    await insertClassSchedule([insertedClass.lastID,0,20,220])
    await insertClassSchedule([insertedClass.lastID,6,2000,2220])


    // 3 Consultar os dados da tabela
    const selectTeachers = await db.all(`SELECT * FROM teachers`)
    console.log(selectTeachers)

    const selectClasses = await db.all(`
        SELECT * 
        FROM classes 
        WHERE teacher_id = 1`)
    console.log(selectClasses)

    const selectClassSchedules = await db.all(`
        SELECT * 
        FROM class_schedule
        WHERE class_id = 1`)
    console.log(selectClassSchedules)
}