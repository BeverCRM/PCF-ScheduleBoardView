import { fetchSelectedMonthRecords } from '../store/services';
import { CalendarDate, Record } from '../utilities/types';
import { getAbsoluteDate } from '../utilities/dateUtilities';

export function getSelectedMonthBookings(
  calendarDays: CalendarDate[][],
): Record[] {
  const calendarRowMaxIndex = 6;
  const startDate = getAbsoluteDate(calendarDays[0][0].value, 'START');
  const endDate = getAbsoluteDate(
    calendarDays[calendarDays.length - 1][calendarRowMaxIndex].value, 'END');
  const bookings = fetchSelectedMonthRecords({ start: startDate, end: endDate });
  return bookings;
}

function prefillEmptySpaceWithBooking(
  item: CalendarDate,
  currentDayBookings: Record[],
  topIndex:number) {
  const temporaryArray = [...item.bookings];
  let b = 0;
  for (let k = 0; k < topIndex; ++k) {
    if (item.bookings[b]?.index !== k) {
      let record:Record;
      if (currentDayBookings.length !== 0) {
        record = currentDayBookings.shift()!;
      }
      else {
        record = {
          id: '1',
          name: 'undefined',
          start: new Date().getTime(),
          end: new Date().getTime(),
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

function getAllBookingsFromPreviousDays(
  item: CalendarDate,
  bookings: Record[],
  defaultBookingIndex:number,
  topIndex:number) : number {
  for (const booking of bookings) {
    if (
      getAbsoluteDate(item.value, 'END') >= new Date(booking.start) &&
      getAbsoluteDate(item.value, 'START') <= new Date(booking.end) &&
      booking.start < booking.end
    ) {
      if (booking.index !== defaultBookingIndex) {
        item.bookings.push(booking);
        if (topIndex <= booking.index) {
          topIndex = booking.index + 1;
        }
      }
    }
  }
  return topIndex;
}

function getNewBookingsFromCurrentDay(
  item:CalendarDate,
  bookings: Record[],
  currentDayBookings:Record[],
  defaultBookingIndex:number,
  maxBookingsCount:number,
) {
  for (const booking of bookings) {
    if (
      getAbsoluteDate(item.value, 'END') >= new Date(booking.start) &&
      getAbsoluteDate(item.value, 'START') <= new Date(booking.end)
    ) {
      if (booking.index === defaultBookingIndex) {
        currentDayBookings.push(booking);
      }
    }
    if (currentDayBookings.length >= maxBookingsCount) {
      break;
    }
  }
}

export function generateCalendarDates(
  combineDates: CalendarDate[][],
  _bookings: Record[],
): CalendarDate[][] {
  const generatedDates: CalendarDate[][] = [...combineDates];
  const defaultBookingIndex = -1;
  const bookings: Record[] = _bookings.map(k => ({ ...k, index: defaultBookingIndex }));
  let previousItem: CalendarDate | undefined;
  const maxBookingsCount = 6;

  generatedDates.forEach(week => {
    week.forEach(item => {
      const currentDayBookings: Record[] = [];
      let topIndex = 0;

      topIndex = getAllBookingsFromPreviousDays(item, bookings, defaultBookingIndex, topIndex);

      getNewBookingsFromCurrentDay(item, bookings, currentDayBookings,
        defaultBookingIndex, maxBookingsCount);

      item.bookings.sort((previous, next) => {
        if (previous.index > next.index) return 1;
        if (previous.index < next.index) return -1;
        if (previous.start > next.start) return 1;
        if (previous.start < next.start) return -1;
        return 0;
      });

      item.bookings = item.bookings.slice(0, maxBookingsCount);

      if (previousItem !== undefined) {
        prefillEmptySpaceWithBooking(item, currentDayBookings, topIndex);
      }
      else {
        item.bookings = item.bookings.concat(currentDayBookings);
      }

      for (let i = 0; i < item.bookings.length; i++) {
        item.bookings[i].index = i;
      }

      for (const booking of item.bookings) {
        booking;
      }
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

export function changeMonth(
  direction: string,
  date: Date,
): Date {
  let changedDate: Date = new Date(date);

  switch (direction) {
    case 'BACK':
      changedDate.setMonth(changedDate.getMonth() - 1);
      break;
    case 'FORWARD':
      changedDate.setMonth(changedDate.getMonth() + 1);
      break;
    case 'TODAY':
      changedDate = new Date();
      break;
  }

  return changedDate;
}

export function changeDay(
  direction: string,
  date: Date,
): Date {
  let changedDate: Date = new Date(date);

  switch (direction) {
    case 'BACK':
      changedDate.setDate(changedDate.getDate() - 1);
      break;
    case 'FORWARD':
      changedDate.setDate(changedDate.getDate() + 1);
      break;
    case 'TODAY':
      changedDate = new Date();
      break;
  }

  return changedDate;
}
