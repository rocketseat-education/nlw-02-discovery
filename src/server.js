// usei o express pra criar e configurar meu servidor
const express = require("express")
const server = express()

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
    watch: true,
    noCache: true, // boolean
})

// criei uma rota /
// e capturo o pedido do cliente para responder
server.get("/", function(req, res) {
    return res.render("pages/landing.njk")
})

server.get("/study", (req, res) => {
    return res.render("pages/study.njk")
})

server.get("/give-classes", (req, res) => {
    return res.render("pages/give-classes.njk")
})


server.post("/give-classes", (req, res) => {

    // req.body: O corpo do nosso formulário
    console.log(req.body)

    // insert teacher
    let teacher
    // insert class

    // insert class schedule

    // inserir dados no banco de dados
    // const query = `
    //     INSERT INTO teachers (
    //         name,
    //         avatar_url,
    //         address,
    //         address2,
    //         state,
    //         city,
    //         items
    //     ) VALUES (?,?,?,?,?,?,?);
    // `

    // const values = [
    //     req.body.image,
    //     req.body.name,
    //     req.body.address,
    //     req.body.address2,
    //     req.body.state,
    //     req.body.city,
    //     req.body.items
    // ]

    // function afterInsertData(err) {
    //     if(err) {
    //         console.log(err)
    //         return res.send("Erro no cadastro!")
    //     }

    //     console.log("Cadastrado com sucesso")
    //     console.log(this)

    //     return res.render("create-point.html", {saved: true})
    // }

    // db.run(query, values, afterInsertData)

})



server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", { total: 0})
    }

    // pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total})
    })
})




// se passar por todos os passos acima
// mas não achou nenhuma página, ele vai cair 
// nessa parte
// server.use((req, res, next) => {
//     return res.send('Página de erro')
// })

// liguei meu servidor na porta 5000
server.listen(5000)