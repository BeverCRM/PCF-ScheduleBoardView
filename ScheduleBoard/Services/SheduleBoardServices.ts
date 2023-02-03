import { cloneDeep } from 'lodash';
import { fetchSelectedMonthRecords } from '../Store/Services';
import { CalendarDate, Record } from '../Store/Types';
import { getAbsoluteDate } from '../Utilities/dateUtilities';

export function getSelectedMonthBookings(
  calendarDays: Array<Array<CalendarDate>>,
): Array<Record> {
  const startDate = getAbsoluteDate(calendarDays[0][0].value, 'START');
  const endDate = getAbsoluteDate(calendarDays[calendarDays.length - 1][6].value, 'END');
  const bookings = fetchSelectedMonthRecords({ start: startDate, end: endDate });
  return bookings;
}

/**
 * * Generate calendar dates by selected and surrounding months
 * * Returns an array of Array\<CalendarDate\>
 * @param daysOfTheSelectedMonth type[`Date[]`] Array of days of the selected month
 * @param daysOfTheSurroundingMonths type[`Date[]`]  Array of days of the surrounding months
*/
export function generateCalendarDates(
  combineDates: Array<Array<CalendarDate>>,
  _bookings: Array<Record>,
): Array<Array<CalendarDate>> {
  const generatedDates: CalendarDate[][] = [...combineDates];
  const bookings:Record[] = cloneDeep(_bookings);
  let previousItem: CalendarDate | undefined;

  bookings.forEach(booking => {
    booking.index = -1;
  });

  generatedDates.forEach(week => {
    week.forEach(item => {
      const currentDayBookings = new Array<Record>();
      let i = 0;
      let j = 0;

      for (const booking of bookings) {
        if (
          getAbsoluteDate(item.value, 'END') >= booking.start &&
          getAbsoluteDate(item.value, 'START') <= booking.end &&
          booking.start.getTime() < booking.end.getTime()
        ) {
          if (booking.index !== -1) {
            item.bookings.push(booking);
            if (i <= booking.index) {
              i = booking.index + 1;
            }
          }
        }
      }

      for (const booking of bookings) {
        if (
          getAbsoluteDate(item.value, 'END') >= booking.start &&
          getAbsoluteDate(item.value, 'START') <= booking.end
        ) {
          if (booking.index === -1) {
            currentDayBookings.push(booking);
          }
        }
        if (currentDayBookings.length >= 6) {
          break;
        }
      }

      item.bookings.sort((previous, next) => {
        if (previous.index > next.index) return 1;
        if (previous.index < next.index) return -1;
        if (previous.start.getTime() > next.start.getTime()) return 1;
        if (previous.start.getTime() < next.start.getTime()) return -1;
        return 0;
      });

      item.bookings = item.bookings.slice(0, 6);
      if (previousItem !== undefined) {
        const temporaryArray = [...item.bookings];
        let b = 0;
        for (let k = 0; k < i; ++k) {
          if (item.bookings[b]?.index !== k) {
            let record:Record;
            if (currentDayBookings.length !== 0) {
              record = currentDayBookings.shift()!;
            }
            else {
              record = {
                id: '1',
                name: 'undefined',
                start: new Date(),
                end: new Date(),
                color: '#FFFFFF',
                index: 0,
              };
            }
            temporaryArray.splice(k, 0, record);
          }
          else {
            ++b;
          }
        }
        item.bookings = temporaryArray.concat(currentDayBookings);
      }
      else {
        item.bookings = item.bookings.concat(currentDayBookings);
      }

      j = 0;
      item.bookings.forEach(booking => {
        booking.index = j;
        ++j;
      });

      if (item.value.getDay() === 0) {
        previousItem = undefined;
      }
      else {
        previousItem = item;
      }
    });
  });
  return generatedDates;
}

/**
 * * Change rendered month based on direction
 * * Returns date of the month
 * @param direction type 'string' diraction to go(back or forth)
 * @param date type 'Date' current date
*/
export function changeMonth(
  direction: string | undefined,
  date: Date,
): Date {
  let changedDate: Date = new Date(date);

  if (direction === 'BACK') {
    changedDate.setMonth(changedDate.getMonth() - 1);
  }
  else if (direction === 'FORWARD') {
    changedDate.setMonth(changedDate.getMonth() + 1);
  }
  else {
    changedDate = new Date();
  }

  return changedDate;
}

export function changeDay(
  direction: string | undefined,
  date: Date,
): Date {
  let changedDate: Date = new Date(date);

  if (direction === 'BACK') {
    changedDate.setDate(changedDate.getDate() - 1);
  }
  else if (direction === 'FORWARD') {
    changedDate.setDate(changedDate.getDate() + 1);
  }
  else {
    changedDate = new Date();
  }

  return changedDate;
}
