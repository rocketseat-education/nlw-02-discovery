// usei o express pra criar e configurar meu servidor
const express = require("express")
const server = express()

// dados fakes 
// const data = require('./database/example.data')
// pegar o banco de dados
const db = require("./database/db")

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

server.get("/study", (req, res) => {
    // console.log(req.query)
    const filter = req.query

    // vamos iniciar um query com um valor null
    let query;

    // se existir todos os parametros da busca
    if (filter.subject && filter.weekday && filter.time) {
        // vamos buscar somente se existir aula no dia e horário do filtro]
        let timeInMinutes = convertHourToMinutes(filter.time)

        query = `
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
    }

    db.then(async db => {
        // se não existir a query, é pq não veio todos os parametros da busca
        // então, mostrar a página vazia
        let sendDataToNunjucks = { subjects: getSubject(), filter }

        // se existe a busca, fazer ajuste dos dados para apresentar
        if (query) {
            
            const results = await db.all(query)

            results.map(teacher => {
                teacher.subject = getSubject(teacher.subject)
            })

            sendDataToNunjucks = { teachers: results, filter, ...sendDataToNunjucks }
        }

        // apresentar os dados no front-end
        return res.render("pages/study.njk", sendDataToNunjucks)

    }).catch( err => console.log(err)) // mostrar os erros de consulta

})

server.get("/give-classes", (req, res) => {
    return res.render("pages/give-classes.njk", { subjects: getSubject()})
})

server.post("/give-classes", (req, res) => {
    const createTeacher = require('./database/createTeacher')

    // req.body: O corpo do nosso formulário
    // console.log(req.body)

    let teacherValue = [
        req.body.name,
        req.body.avatar,
        req.body.whatsapp,
        req.body.bio
    ]

    let classValue = [
        +req.body.subject,
        +req.body.cost
        // teacher_id iremos pegar dentro da função createTeacher
    ]


    let classScheduleValues = []

    req.body.weekday.forEach((day, index) => {
        classScheduleValues.push([
            +day, 
            convertHourToMinutes(req.body.time_from[index]), 
            convertHourToMinutes(req.body.time_to[index])
        ])
    })

    db.then( async db => {
        await createTeacher(db, { teacherValue, classValue, classScheduleValues })

        return res.redirect(`/study?subject=${req.body.subject}&weekday=${req.body.weekday[0]}&time=${req.body.time_from[0]}`)
    })
    
})

// se passar por todos os passos acima
// mas não achou nenhuma página, ele vai cair 
// nessa parte
server.use((req, res, next) => {
    return res.send('Página de erro')
})

// liguei meu servidor na porta 5000
server.listen(5000)