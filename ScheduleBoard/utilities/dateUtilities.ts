import { CalendarDate, SurroundingMonthsDate } from './types';

export function getDaysOfSelectedMonth(
  month: number,
  year: number,
): Date[] {
  const days: Date[] = [];
  let date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(date);
    date = new Date(year, month, date.getDate() + 1);
  }

  return days;
}

export function getDaysOfSurroundingMonths(
  startDate: Date,
  endDate: Date,
): SurroundingMonthsDate {
  const days: SurroundingMonthsDate = {
    previousMonthDays: [],
    nextMonthDays: [],
  };

  const currentStartDate = new Date(startDate);
  const currentEndDate = new Date(endDate);

  while (currentStartDate.getDay() !== 1) {
    currentStartDate.setDate(currentStartDate.getDate() - 1);
    days.previousMonthDays.push(new Date(currentStartDate));
  }

  while (currentEndDate.getDay() !== 0) {
    currentEndDate.setDate(currentEndDate.getDate() + 1);
    days.nextMonthDays.push(new Date(currentEndDate));
  }

  days.previousMonthDays.reverse();

  return days;
}

function addCalendarDateIntoCombinedDates(
  combinedDates: CalendarDate[][],
  item: Date,
  isTheItemOfTheSelectedMonth: boolean,
) {
  const calendarDate: CalendarDate = {
    value: item,
    day: item.getDate().toString(),
    isTheItemOfTheSelectedMonth,
    bookings: [],
  };

  combinedDates[combinedDates.length - 1].push(calendarDate);
}

export function combineDates(
  daysOfSelectedMonth: Date[],
  daysOfSurroundingMonths: SurroundingMonthsDate,
): CalendarDate[][] {
  const combinedDates: CalendarDate[][] = [];
  combinedDates.push([]);
  const weekDaysCount = 7;

  daysOfSurroundingMonths.previousMonthDays.forEach(item => {
    addCalendarDateIntoCombinedDates(combinedDates, item, false);
  });

  daysOfSelectedMonth.forEach(item => {
    if (combinedDates[combinedDates.length - 1].length === weekDaysCount) {
      combinedDates.push([]);
    }
    addCalendarDateIntoCombinedDates(combinedDates, item, true);
  });

  daysOfSurroundingMonths.nextMonthDays.forEach(item => {
    addCalendarDateIntoCombinedDates(combinedDates, item, false);
  });

  return combinedDates;
}

export function isoDateFormatting(date: Date | string): string {
  const d = new Date(date);
  if (d.toString() === 'Invalid Date') return 'Invalid Date';

  return `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${
    d.getMonth() + 1
  }-${d.getDate() < 10 ? '0' : ''}${d.getDate()}`;
}

/**
  * * Get date absolute time
  * * Returns a date with time 00:00:00 or 23:59:59
  * @param date type[`Date`] Input date
  * @param type type[`string`] Type for choosing the date with 00:00:00(`START`) time or with 23:59:59(`END`) time
*/
export function getAbsoluteDate(date: Date, type: string): Date {
  const isoDate: number[] = isoDateFormatting(date)
    .split('-')
    .map(value => Number(value));
  let newDate: Date = new Date('');

  if (type === 'START') {
    newDate = new Date(isoDate[0], isoDate[1] - 1, isoDate[2], 0, 0, 0);
  }
  else if (type === 'END') {
    newDate = new Date(isoDate[0], isoDate[1] - 1, isoDate[2], 23, 59, 59);
  }

  return newDate;
}
