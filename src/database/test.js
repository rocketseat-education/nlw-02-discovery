const db = require('./db')
const createTeacher = require('./createTeacher')

db.then(async(db) => {

    teacherValue = {
        name: "Mayk Brito",
        avatar: "https://avatars2.githubusercontent.com/u/6643122?s=460&u=1e9e1f04b76fb5374e6a041f5e41dce83f3b5d92&v=4",
        whatsapp: "7899887766",
        bio: "Instrutor de Educação Física para iniciantes, minha missão de vida é levar saúde e contribuir para o crescimento de quem se interessar. Comecei a minha jornada profissional em 2001, quando meu pai me deu dois alteres de 32kg com a seguinte condição: \"Aprenda a fazer dinheiro com isso!\""
    }

    classValue = {
        subject: '1',
        cost: '100',
        // teacher_id iremos pegar dentro da função createTeacher
    }

    classScheduleValues = [
        {
            // class_id iremos pegar dentro da função
            weekday: 1,
            time_from: 720,
            time_to: 1220
        },
        {
            // class_id iremos pegar dentro da função
            weekday: 3,
            time_from: 820,
            time_to: 1220
        },
        {
            // class_id iremos pegar dentro da função
            weekday: 0,
            time_from: 20,
            time_to: 220
        },
        {
            // class_id iremos pegar dentro da função
            weekday: 6,
            time_from: 2000,
            time_to: 2220
        },
    ]

    await createTeacher(db, { teacherValue, classValue, classScheduleValues })
    
    
    // Consultar os dados da tabela
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
})
