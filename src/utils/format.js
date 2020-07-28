function onlyNumber(value) {
    return value.replace(/\D/gi, "")
}

function convertHourToMinutes(time) {
    const [hour, minutes] = time.split(':').map(Number);
    const timeInMinutes = (hour * 60) + minutes;

    return timeInMinutes;
}

// console.log(convertHourToMinutes('12:59'))
// console.log(onlyNumber("12cc,,,...343sdadfef"))

module.exports = {
    onlyNumber,
    convertHourToMinutes
}
