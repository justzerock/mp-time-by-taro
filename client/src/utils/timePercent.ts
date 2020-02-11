const timePercent = (type: string, date1= new Date(1993, 0, 1), date2= new Date(1993 + 77, 0, 1)) => {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()
  let weekDay = date.getDay()
  let day = date.getDate()
  let now = Date.now()
  let percent = 0
  switch (type) {
    case 'year':
      let yearStart = getMyTime(year, 0, 1)
      let yearEnd = getMyTime(year + 1, 0, 1)
      percent = getPercent((now - yearStart)/(yearEnd - yearStart))
      return {time: year, percent}
      break
    case 'month':
      let monthStart = getMyTime(year, month, 1)
      let monthEnd = getMyTime(year, month + 1, 1)
      percent = getPercent((now - monthStart)/(monthEnd - monthStart))
      return {time: month + 1, percent}
      break
    case 'week':
      let weekStart = getMyTime(year, month, day - weekDay)
      let weekEnd = getMyTime(year, month, day + 7 - weekDay)
      percent = getPercent((now - weekStart)/(weekEnd - weekStart))
      return {time: weekDay, percent}
      break
    case 'day':
      let dayStart = getMyTime(year, month, day)
      let dayEnd = getMyTime(year, month, day + 1)
      percent = getPercent((now - dayStart)/(dayEnd - dayStart))
      return {time: day, percent}
      break
    case 'life':
      let age = year - date1.getFullYear()
      let midDate = new Date(date1.getTime())
      let curYear = new Date(midDate.setFullYear(midDate.getFullYear() + age))
      age = curYear > date ? age-1 : age
      let lifeStart = date1.getTime()
      let lifeEnd = date2.getTime()
      percent = getPercent((now - lifeStart)/(lifeEnd - lifeStart))
      return {time: age, percent}
      break
  }
}

const getMyTime = (year: number, month: number, day: number) => {
  return new Date(year, month, day).getTime()
}

const getPercent = (percent: number) => {
  return Math.floor(percent * 1000) / 10
}

export default { timePercent }