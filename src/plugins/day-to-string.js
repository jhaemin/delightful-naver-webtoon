module.exports = function(dayIndex, lang) {
  if (dayIndex < 0 || dayIndex > 6) {
    console.error('Wrong day index')
    return ''
  }

  let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  let daysKr = ['일', '월', '화', '수', '목', '금', '토']

  if (lang === 'kr') {
    return daysKr[dayIndex]
  } else {
    return days[dayIndex]
  }
}
