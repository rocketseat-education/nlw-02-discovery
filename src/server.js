// usei o express pra criar e configurar meu servidor
const express = require("express")
const server = express()

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
    return res.render("pages/study.njk")
})

server.get("/give-classes", (req, res) => {
    return res.render("pages/give-classes.njk")
})

// se passar por todos os passos acima
// mas não achou nenhuma página, ele vai cair 
// nessa parte
server.use((req, res, next) => {
    return res.send('Página de erro')
})

// liguei meu servidor na porta 5000
server.listen(5000)