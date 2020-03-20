const timePercent = (type: string, wStart = 0, date1= new Date(), date2= new Date()) => {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()
  let weekDay = date.getDay()
  let day = date.getDate()
  let now = Date.now()
  let percent = 0
  let passedDays = 0
  let passedHours = 0
  switch (type) {
    case 'year':
      let yearStart = getMyTime(year, 0, 1)
      let yearEnd = getMyTime(year + 1, 0, 1)
      passedDays = getPassedDays(now - yearStart)
      percent = getPercent((now - yearStart)/(yearEnd - yearStart))
      return {time: year, percent, detail: passedDays}
      break
    case 'month':
      let monthStart = getMyTime(year, month, 1)
      let monthEnd = getMyTime(year, month + 1, 1)
      passedDays = getPassedDays(now - monthStart)
      percent = getPercent((now - monthStart)/(monthEnd - monthStart))
      return {time: month + 1, percent, detail: passedDays}
      break
    case 'week':
      let days = getDays(wStart, weekDay) 
      let weekStart = getMyTime(year, month, day - days)
      let weekEnd = getMyTime(year, month, day + 7 - days)
      passedDays = getPassedDays(now - weekStart)
      percent = getPercent((now - weekStart)/(weekEnd - weekStart))
      return {time: weekDay, percent, detail: passedDays}
      break
    case 'day':
      let dayStart = getMyTime(year, month, day)
      let dayEnd = getMyTime(year, month, day + 1)
      passedHours = Math.floor((now - dayStart)/3600000)
      percent = getPercent((now - dayStart)/(dayEnd - dayStart))
      return {time: day, percent, detail: passedHours}
      break
    case 'life':
      let age = year - date1.getFullYear()
      let midDate = new Date(date1.getTime())
      let curYear = new Date(midDate.setFullYear(midDate.getFullYear() + age))
      age = curYear > date ? age-1 : age
      let lifeStart = date1.getTime()
      let lifeEnd = date2.getTime()
      passedDays = getPassedDays(now - lifeStart)
      percent = getPercent((now - lifeStart)/(lifeEnd - lifeStart))
      return {time: age, percent, detail: passedDays}
      break
  }
}

const getPassedDays = (time) => {
  return Math.floor(time/86400000)
}

const getDays = (wStart, weekDay) => {
  let days = weekDay
  if (wStart) {
    if (weekDay) {
      days -= 1
    } else {
      days += 6
    }
  }
  return days
}

const getMyTime = (year: number, month: number, day: number) => {
  return new Date(year, month, day).getTime()
}

const getPercent = (percent: number) => {
  return Math.floor(percent * 1000) / 10
}

export default { timePercent }
