import * as React from "react";
import {
  changeMonth,
  combineDates,
  generateCalendarDates,
  getDaysOfTheSelectedMonth,
  GetSelectedMonthBookings,
  getTheDaysOfTheSurroundingMonths,
  TodayButtonIsDisabled,
} from "../Services/SheduleBoardServices";

export type DataSet = ComponentFramework.PropertyTypes.DataSet;
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
export type Record = {
  id: string;
  name: string;
  start: Date;
  end: Date;
  color: string;
  isUnreal: boolean;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export interface SheduleBoradTime {
  onChange: (date: Date | null) => void;
  currentDate: Date;
  calendarDays: Array<Array<CalendarDate>>;
}

export const SheduleBoard: React.FunctionComponent<SheduleBoradTime> = (
  props
) => {
  const { onChange, currentDate, calendarDays } = props;
  const [date, setDate] = React.useState(currentDate);

  const daysOfTheSelectedMonth: Array<Date> = getDaysOfTheSelectedMonth(
    date.getMonth(),
    date.getFullYear()
  );
  const daysOfTheSurroundingMonths: SurroundingMonthsDate =
    getTheDaysOfTheSurroundingMonths(
      daysOfTheSelectedMonth[0],
      daysOfTheSelectedMonth.slice(-1)[0]
    );
  const combinedDates = combineDates(
    daysOfTheSelectedMonth,
    daysOfTheSurroundingMonths
  );
  const bookings = GetSelectedMonthBookings(combinedDates);
  const days = generateCalendarDates(combinedDates, bookings);
  const Title = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;

  React.useEffect(() => {
    setDate(currentDate);
  }, [currentDate]);

  const isDisabled = TodayButtonIsDisabled(date);
  return (
    <div className="main">
      <div className="scheduleBoard">
        <div className="header">
          <div className="h_content">
            <div className="arrowButtons">
              <span
                className="arrow"
                onClick={() => setDate(changeMonth("BACK", date))}
              >
                <button>&lt;</button>
              </span>
              <span
                className="arrow"
                onClick={() => setDate(changeMonth("FORWARD", date))}
              >
                <button>&gt;</button>
              </span>
              <span
                className="today"
                onClick={() => setDate(changeMonth(undefined, date))}
              >
                <button disabled={isDisabled}>Current</button>
              </span>
            </div>
            <div className="period">{Title}</div>
          </div>
        </div>
        <div className="calendar">
          <div className="c_content">
            <div className="weekDays">
              <ul>
                <li>Mon</li>
                <li>Tue</li>
                <li>Wed</li>
                <li>Thu</li>
                <li>Fri</li>
                <li>Sat</li>
                <li>Sun</li>
              </ul>
            </div>
            <div className="calendar-body">
              <table>
                {days.map((row, i) => (
                  <tr className="row" key={i}>
                    {row.map((date, j) => (
                      <td
                        key={j}
                        className={j == 5 || j == 6 ? "day-off" : "cell"}
                      >
                        <div className="cell-content">
                          <span
                            className={
                              date.isTheItemOfTheSelectedMonth
                                ? "inputDate"
                                : "day-of-the-surrounding-month"
                            }
                          >
                            {date.day}
                          </span>
                          <div className="bookings">
                            <div
                              className="booking"
                              {...date.bookings.map((booking, k) => (
                                <div key={k} className="booking-row">
                                  <span className="booking-name">
                                    {booking.name}
                                  </span>
                                </div>
                              ))}
                            ></div>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
