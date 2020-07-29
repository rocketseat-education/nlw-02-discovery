function convertHourToMinutes(time) {
    const [hour, minutes] = time.split(':').map(Number);
    const timeInMinutes = (hour * 60) + minutes;

    return +timeInMinutes;
}

function getSubject(subject) {
    const subjects = [
        "Artes",
        "Biologia",
        "Ciências",
        "Educação Física",
        "Física",
        "Geografia",
        "História",
        "Matemática",
        "Português",
        "Química",
    ]

    let response = subjects[subject - 1]

    if (!response)
        return subjects
    
    return response
}

// console.log(getSubject(0))
// console.log(getSubject(1))
// console.log(getSubject(11))
// console.log(getSubject())

// console.log(convertHourToMinutes('12:59'))

module.exports = {
    convertHourToMinutes,
    getSubject
}
