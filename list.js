export default (year, month) => {

    // 这个月有多少天
    var thisMonthDate = new Date(year, month, 0).getDate();
    // 上给月有多少天
    var previousMonthDate = new Date(year, month - 1, 0).getDate();
    // 这个月的第一天是星期几
    var theFirst = new Date(`${month}/1/${year}`).getDay();
    theFirst = theFirst == 0 ? 7 : theFirst;
    // 上个月补的
    var previousSubstitute = [];
    for (let i = previousMonthDate; i > previousMonthDate - theFirst; i--) {
        previousSubstitute.unshift(i);
    }
    // 下个月补的
    var nextSubstitute = [];
    for (var i = 1; i <= 42 - theFirst - thisMonthDate; i++) {
        nextSubstitute.push(i);
    }
    return [previousSubstitute, nextSubstitute, thisMonthDate]
}
