module.exports = function(dayStr: string) {
  dayStr = dayStr.toLowerCase()
  let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  let daysKr = ['일', '월', '화', '수', '목', '금', '토']

  if (days.indexOf(dayStr) === -1) {
    console.error('Wrong day name.')
    return ''
  } else {
    return daysKr[days.indexOf(dayStr)]
  }
}
