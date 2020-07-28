const fields = document.querySelectorAll('[required]')

for (let field of fields) {
    field.addEventListener('invalid', changeInvalidMessage)
}

function changeInvalidMessage(event) {
    const field = event.target
    
    // verificar se exitem erros
    const verifyErrors = () => {
        let foundError = false;

        for( let error in field.validity) {
            // se não for customError, verifica se existem erros
            if (error !== "customError" && field.validity[error])
                foundError = error
        }

        return foundError
    }

    if (verifyErrors()) {
        console.log(verifyErrors())
        field.setCustomValidity("Preencha corretamente")
    } else {
        field.setCustomValidity("")
    }

}