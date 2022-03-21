export const getFormattedDate = (date: Date) => {
  return `${date.getUTCFullYear()}-${getFormattedDayOrMonth(date.getUTCMonth() + 1)}-${getFormattedDayOrMonth(date.getDate())}`
}

const getFormattedDayOrMonth = (dayOrMonth: Number) => {
  if (dayOrMonth <= 9) {
    return `0${dayOrMonth}`
  }
  else return dayOrMonth
}