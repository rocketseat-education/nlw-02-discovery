// usei o express pra criar e configurar meu servidor
const express = require("express")
const server = express()

// dados fakes 
// const data = require('./database/example.data')
// pegar o banco de dados
const dbConnection = require("./database/db")

// utils
const { convertHourToMinutes, getSubject } = require('./utils/format')

// habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

// configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true, // boolean
})

// criei uma rota /
// e capturo o pedido do cliente para responder
server.get("/", function(req, res) {
    return res.render("pages/landing.njk")
})

server.get("/study", async(req, res) => {
    // console.log(req.query)
    const filter = req.query

    // lista de matérias
    const subjects = getSubject()

    if (!filter.subject || !filter.weekday || !filter.time) {
        // Não foi feita a pesquisa, ou está faltando dados,
        // apresentar a página sem professores, vazia, ou seja, 
        // teachers vazio.

        return res.render("pages/study.njk", { subjects, teachers: "" })
    }
        
    // vamos buscar somente se existir aula no dia e horário do filtro]
    let timeInMinutes = convertHourToMinutes(filter.time)

    // vamos pegar as consultas que fizemos antes lá nos testes do banco de dados.
    const query = `
        SELECT classes.*, teachers.*
        FROM teachers
        JOIN classes ON (classes.teacher_id = teachers.id)
        WHERE EXISTS(
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = '${filter.weekday}'
            AND class_schedule.time_from <= '${timeInMinutes}' 
            AND class_schedule.time_to > '${timeInMinutes}'
        )
        AND classes.subject = '${filter.subject}';`
    
    // console.log(query)
    
    // usamos o try / catch, para capturar possíveis erros da aplicação
    try { 
        const db = await dbConnection;    
        const teachers = await db.all(query)

        teachers.map(teacher => {
            teacher.subject = getSubject(teacher.subject)
        })

        // apresentar os dados no front-end
        return res.render("pages/study.njk", { subjects, filter, teachers })
        
    } catch (error) {
        console.log(error) // mostrar os possíveis erros
    }

})

server.get("/give-classes", (req, res) => {
    return res.render("pages/give-classes.njk", { subjects: getSubject()})
})

server.post("/give-classes", async(req, res) => {
    const createTeacher = require('./database/createTeacher')

    // req.body: O corpo do nosso formulário, os campos.
    // console.log(req.body)

    let teacherValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }

    let classValue = {
        subject: req.body.subject,
        cost: req.body.cost
        // teacher_id iremos pegar dentro da função createTeacher
    }


    let classScheduleValues = []
    req.body.weekday.forEach((weekday, index) => {

        const classSchedule = {
            weekday: req.body.weekday,
            time_from: convertHourToMinutes(req.body.time_from[index]), 
            time_to: convertHourToMinutes(req.body.time_to[index])
        }

        classScheduleValues.push(classSchedule)
    })

    const db = await dbConnection
    await createTeacher(db, { teacherValue, classValue, classScheduleValues })



    let queryString = '?subject=' + req.body.subject
    queryString += '&weekday=' + req.body.weekday[0]
    queryString += '&time=' + req.body.time_from[0]

    //console.log(queryString)

    return res.redirect(`/study${queryString}`)
    
})

// liguei meu servidor na porta 5000
server.listen(5000)