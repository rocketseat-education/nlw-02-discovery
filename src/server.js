// usei o express pra criar e configurar meu servidor
const express = require("express")
const server = express()

// dados fakes
// const data = require('./database/example.data')
// pegar o banco de dados
const db = require("./database/db")

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
    const convertHourToMinutes = require('./utils/format').convertHourToMinutes
    const getSubject = require('./utils/format').getSubject

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
        let sendDataToNunjucks = { subjects: getSubject() }
        // se não existir a query, é pq não veio todos os parametros da busca
        // então, mostrar a página vazia
        if (!query) {
            sendDataToNunjucks = { filter, ...sendDataToNunjucks }
        } else {
            // existe a busca ...
            const results = await db.all(query)

            results.map(teacher => {
                teacher.subject = getSubject(teacher.subject)
            })

            sendDataToNunjucks = { teachers: results, filter, ...sendDataToNunjucks }
        }

        return res.render("pages/study.njk", sendDataToNunjucks)

    }).catch( err => console.log(err)) // mostrar os erros de consulta

})

server.get("/give-classes", (req, res) => {
    const getSubject = require('./utils/format').getSubject

    return res.render("pages/give-classes.njk", { subjects: getSubject()})
})

server.post("/give-classes", (req, res) => {

    // req.body: O corpo do nosso formulário
    console.log(req.body)

})

// se passar por todos os passos acima
// mas não achou nenhuma página, ele vai cair 
// nessa parte
// server.use((req, res, next) => {
//     return res.send('Página de erro')
// })

// liguei meu servidor na porta 5000
server.listen(5000)