import {CalendarDate,SurroundingMonthsDate,Record,} from "../Components/SheduleBoard";
import { store} from "../Store/Store";

/**
 * My Own Functions
 * ***
 * * Get days of the selected month by month number and year
 * * Returns an array of Date objects
 * @param month type[`number`] Month number in the calendar (0-11)
 * @param year type[`number`] Year in the calendar
 */

export function TodayButtonIsDisabled(date: Date): boolean {
  return (
    date.getMonth() === new Date().getMonth() &&
    date.getFullYear() === new Date().getFullYear()
  );
}

export function getDaysOfTheSelectedMonth(
  month: number,
  year: number
): Array<Date> {
  const days: Array<Date> = [];

  let i = 1;
  let date: Date = new Date(year, month, i);

  while (date.getMonth() == month) {
    days.push(date);
    date = new Date(year, month, ++i);
  }

  return days;
}

/**
 * My Own Functions
 * ***
 * * Get the days of the surrounding months
 * * Returns an object SurroundingMonthsDate
 * @param startDate type[`Date`] Calendar start date
 * @param endDate type[`Date`] Calendar end date
 */

/* function getTitle(): string {
  return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
} */

export function getTheDaysOfTheSurroundingMonths(
  startDate: Date,
  endDate: Date
): SurroundingMonthsDate {
  const days: SurroundingMonthsDate = {
    previousMonthDays: Array<Date>(),
    nextMonthDays: Array<Date>(),
  };

  const dateOfPreviousMonth: Date = new Date(startDate);
  const dateOfNextMonth: Date = new Date(endDate);

  while (dateOfPreviousMonth.getDay() != 1) {
    dateOfPreviousMonth.setDate(dateOfPreviousMonth.getDate() - 1);
    days.previousMonthDays.push(new Date(dateOfPreviousMonth));
  }

  while (dateOfNextMonth.getDay() != 0) {
    dateOfNextMonth.setDate(dateOfNextMonth.getDate() + 1);
    days.nextMonthDays.push(new Date(dateOfNextMonth));
  }

  days.previousMonthDays.reverse();

  return days;
}

/**
 * My Own Functions
 * ***
 * * Generate calendar dates by selected and surrounding months
 * * Returns an array of Array\<CalendarDate\>
 * @param daysOfTheSelectedMonth type[`Date[]`] Array of days of the selected month
 * @param daysOfTheSurroundingMonths type[`Date[]`]  Array of days of the surrounding months
 */
export function combineDates(
  daysOfTheSelectedMonth: Array<Date>,
  daysOfTheSurroundingMonths: SurroundingMonthsDate
): Array<Array<CalendarDate>> {
  const combinedDates = new Array<Array<CalendarDate>>();
  combinedDates.push(new Array<CalendarDate>());

  daysOfTheSurroundingMonths.previousMonthDays.forEach((item) => {
    const calendarDate: CalendarDate = {
      value: item,
      day: item.getDate().toString(),
      isTheItemOfTheSelectedMonth: false,
      bookings: new Array<Record>(),
    };

    combinedDates[0].push(calendarDate);
  });

  daysOfTheSelectedMonth.forEach((item) => {
    if (combinedDates[combinedDates.length - 1].length == 7)
      combinedDates.push(new Array<CalendarDate>());

    const calendarDate: CalendarDate = {
      value: item,
      day: item.getDate().toString(),
      isTheItemOfTheSelectedMonth: true,
      bookings: new Array<Record>(),
    };

    combinedDates[combinedDates.length - 1].push(calendarDate);
  });

  daysOfTheSurroundingMonths.nextMonthDays.forEach((item) => {
    const calendarDate: CalendarDate = {
      value: item,
      day: item.getDate().toString(),
      isTheItemOfTheSelectedMonth: false,
      bookings: new Array<Record>(),
    };

    combinedDates[combinedDates.length - 1].push(calendarDate);
  });

  return combinedDates;
}

/**
 * My Own Functions
 * ***
 * * Generate calendar dates by selected and surrounding months
 * * Returns an array of Array\<CalendarDate\>
 * @param daysOfTheSelectedMonth type[`Date[]`] Array of days of the selected month
 * @param daysOfTheSurroundingMonths type[`Date[]`]  Array of days of the surrounding months
 */
export function generateCalendarDates(
  combineDates: Array<Array<CalendarDate>>,
  _bookings: Array<Record>
): Array<Array<CalendarDate>> {
  const generatedDates = new Array<Array<CalendarDate>>(...combineDates);
  const bookings = new Array<Record>(..._bookings);

  generatedDates.forEach((week) => {
    week.forEach((item) => {
      for (const booking of bookings) {
        if (
          getAbsoluteDate(item.value, "END") >= booking.start &&
          getAbsoluteDate(item.value, "START") <= booking.end
        )
          item.bookings.push(booking);
      }

      item.bookings.sort(
        (previous, next) => previous.start.getTime() - next.start.getTime()
      );
    });
  });

  return generatedDates;
}

/**
 * My Own Functions
 * ***
 * * Creating unreal records so as not to disturb the order of bookings
 * * Returns an array of CalendarDate array
 * @param days type[`CalendarDate[][]`] Generated calendar dates
 */
export function createHiddenBookings(
  days: Array<Array<CalendarDate>>
): Array<Array<CalendarDate>> {
  days.forEach((week) => {
    let recordWithTheMaxNumberOfBookings = 0;
    let localBookings: Array<Record> = new Array<Record>();

    week.forEach((item, index) => {
      if (item.bookings.length > localBookings.length) {
        localBookings = item.bookings;
        recordWithTheMaxNumberOfBookings = index;
      }
    });

    localBookings = new Array<Record>();
    week[recordWithTheMaxNumberOfBookings].bookings.forEach((item) => {
      const currentLocalRecord: Record = {
        id: item.id,
        name: item.name,
        start: item.start,
        end: item.end,
        color: item.color,
        isUnreal: true,
      };

      localBookings.push(currentLocalRecord);
    });

    week.forEach((item) => {
      localBookings.forEach((currentBooking, index) => {
        if (
          item.bookings.findIndex(
            (booking) => booking.id === currentBooking.id
          ) === -1
        ) {
          item.bookings.splice(index, 0, currentBooking);
        }
      });
    });
  });

  return days;
}

/**
 * My Own Functions
 * ***
 * * Get date absolute time
 * * Returns a date with time 00:00:00 or 23:59:59
 * @param date type[`Date`] Input date
 * @param type type[`string`] Type for choosing the date with 00:00:00(`START`) time or with 23:59:59(`END`) time
 */
export function getAbsoluteDate(date: Date, type: string): Date {
  const isoDate: Array<number> = isoDateFormatting(date)
    .split("-")
    .map((value) => Number(value));
  let newDate: Date = new Date("");

  if (type === "START")
    newDate = new Date(isoDate[0], isoDate[1] - 1, isoDate[2], 0, 0, 0);
  else if (type === "END")
    newDate = new Date(isoDate[0], isoDate[1] - 1, isoDate[2], 23, 59, 59);

  return newDate;
}

/**
 * My Own Functions
 * ***
 * * Converting the date to iso string
 * * Returns a date isoString
 * @param date type[`Date`] Date to convert iso format
 */
export function isoDateFormatting(date: Date | string): string {
  const d = new Date(date);
  if (d.toString() === "Invalid Date") return "Invalid Date";

  return `${d.getFullYear()}-${d.getMonth() < 9 ? "0" : ""}${
    d.getMonth() + 1
  }-${d.getDate() < 10 ? "0" : ""}${d.getDate()}`;
}

export function GetSelectedMonthBookings(
 calendarDays: Array<Array<CalendarDate>>
): Array<Record> {
  //const startDate = getAbsoluteDate(calendarDays[0][0].value, "START");
  //const endDate = getAbsoluteDate(calendarDays[calendarDays.length - 1][6].value,"END");
  //store.dispatch('fetchSelectedMonthRecords', { start: startDate, end: endDate });
  //FetchSelectedMonthRecords({ start: startDate, end: endDate });
  //const bookings = useSelector<IState,IState["selectedMonthRecords"]>((state) => state.selectedMonthRecords)
  const bookings = store.getState().selectedMonthRecords;
  //const bookings  = new Array<Record>
  return bookings;
} //

export function changeMonth(
  direction: string | undefined = undefined,
  date: Date
): Date {
  let changedDate: Date = new Date(date);

  if (direction == "BACK") changedDate.setMonth(changedDate.getMonth() - 1);
  else if (direction == "FORWARD")
    changedDate.setMonth(changedDate.getMonth() + 1);
  else changedDate = new Date();

  return changedDate;
}
