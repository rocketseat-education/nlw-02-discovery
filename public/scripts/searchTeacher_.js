const form      = document.querySelector('form#search-teachers')
const subject   = form.querySelector('#subject')
const weekday   = form.querySelector('#weekday')
const time      = form.querySelector('#time')

let timer; // temporizador para controlar o tempo de execução da busca automática
function listenForChanges(input) {

    input.addEventListener('change', event => {
        let delay = 200 // tempo de espera para executar o envio do form

        const changingTime = event.target.id === 'time'
        if (changingTime)
            delay = 1000 // para dar tempo do usuário mudar o horário

        if(subject.value && weekday.value && time.value) {
            clearTimeout(timer) // resetar o temporizador da busca automática

            timer = setTimeout(() => {
                form.submit()
            }, delay) // aguardar o delay para executar o submit
        }
    })
}

// sempre que modificarmos um campo, iremos fazer a consulta
listenForChanges(subject)
listenForChanges(weekday)
listenForChanges(time)