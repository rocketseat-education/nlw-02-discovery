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


    // Consultar as classes de um determinado professor
    // e trazer junto os dados do professor
    const selectClassesAndTeachers = await db.all(`
        SELECT classes.*, teachers.*
        FROM teachers
        JOIN classes ON (classes.teacher_id = teachers.id)
        WHERE classes.teacher_id = 1`)
    console.log(selectClassesAndTeachers)


    // o horário deverá ser menor do que o solicitado
    // se a pessoa trabalha das 8h - 18h 
    // o time_from precisa ser antes ou igual ao horário solicitado.
    // o time_to precisa ser acima 
    const selectClassSchedules = await db.all(`
        SELECT class_schedule.*
        FROM class_schedule
        WHERE class_schedule.class_id = classes.id
        AND class_schedule.weekday = '6'
        AND class_schedule.time_from <= '2100' 
        AND class_schedule.time_to > '2100'`)
    console.log(selectClassSchedules)
})
