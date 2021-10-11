export default function (year) {
    let newYear = year - (year % 10)
    let yearArr = []
    for (var i = newYear; i < newYear + 10; i++) {
        yearArr.push(i)
    }
    return yearArr
}