import { Record } from '../Store/types';

/**
 * * Get days of the selected month by month number and year
 * * Returns an array of Date objects
 * @param month type[`number`] Month number in the calendar (0-11)
 * @param year type[`number`] Year in the calendar
 */

export type SurroundingMonthsDate = {
    previousMonthDays: Array<Date>;
    nextMonthDays: Array<Date>;
  };
export type CalendarDate = {
    value: Date;
    day: string;
    isTheItemOfTheSelectedMonth: boolean;
    bookings: Array<Record>;
  };

export function getDaysOfSelectedMonth(
  month: number,
  year: number,
): Array<Date> {
  const days: Array<Date> = [];

  let i = 1;
  let date = new Date(year, month, i);

  while (date.getMonth() === month) {
    days.push(date);
    date = new Date(year, month, ++i);
  }

  return days;
}

/**
   * * Get the days of the surrounding months
   * * Returns an object SurroundingMonthsDate
   * @param startDate type[`Date`] Calendar start date
   * @param endDate type[`Date`] Calendar end date
   */
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

/**
   * * Generate calendar dates by selected and surrounding months
   * * Returns an array of Array\<CalendarDate\>
   * @param daysOfTheSelectedMonth type[`Date[]`] Array of days of the selected month
   * @param daysOfTheSurroundingMonths type[`Date[]`]  Array of days of the surrounding months
   */
export function combineDates(
  daysOfSelectedMonth: Array<Date>,
  daysOfSurroundingMonths: SurroundingMonthsDate,
): Array<Array<CalendarDate>> {
  const combinedDates: Array<Array<CalendarDate>> = [];
  combinedDates.push([]);

  daysOfSurroundingMonths.previousMonthDays.forEach(item => {
    const calendarDate: CalendarDate = {
      value: item,
      day: item.getDate().toString(),
      isTheItemOfTheSelectedMonth: false,
      bookings: [],
    };

    combinedDates[0].push(calendarDate);
  });

  daysOfSelectedMonth.forEach(item => {
    if (combinedDates[combinedDates.length - 1].length === 7) {
      combinedDates.push([]);
    }

    const calendarDate: CalendarDate = {
      value: item,
      day: item.getDate().toString(),
      isTheItemOfTheSelectedMonth: true,
      bookings: [],
    };

    combinedDates[combinedDates.length - 1].push(calendarDate);
  });

  daysOfSurroundingMonths.nextMonthDays.forEach(item => {
    const calendarDate: CalendarDate = {
      value: item,
      day: item.getDate().toString(),
      isTheItemOfTheSelectedMonth: false,
      bookings: [],
    };

    combinedDates[combinedDates.length - 1].push(calendarDate);
  });

  return combinedDates;
}

/**
   * * Converting the date to iso string
   * * Returns a date isoString
   * @param date type[`Date`] Date to convert iso format
   */
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
  const isoDate: Array<number> = isoDateFormatting(date)
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
