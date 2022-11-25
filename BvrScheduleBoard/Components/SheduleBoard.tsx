import * as React from 'react';
import { ReactNode } from 'react';
import {
  changeMonth,
  generateCalendarDates,
  changeColor,
  getSelectedMonthBookings,
} from '../Services/sheduleBoardServices';
import DataverseService from '../Services/dataverseService';
import {
  combineDates,
  getDaysOfSelectedMonth,
  getDaysOfSurroundingMonths,
  CalendarDate,
  SurroundingMonthsDate,
} from '../Utilities/dateUtilities';
import Tooltip from 'react-tooltip-lite';
import { setSelectedMonthRecords, store } from '../Store/store';

// export type DataSet = ComponentFramework.PropertyTypes.DataSet;

enum MONTH_NAMES {
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
}

enum WEEK_DAYS {
  Monday = 'Mon',
  Tuesday = 'Tue',
  Wednesday = 'Wed',
  Thuesday = 'Thu',
  Friday = 'Fri',
  Saturnday = 'Sat',
  Sunday = 'Sun',
}

export interface SheduleBoardTime {
  onChange: (date: Date | null) => void;
  currentDate: Date;
  calendarDays: Array<Array<CalendarDate>>;
}
declare module 'react-tooltip-lite' {
  export interface TooltipProps {
    children: ReactNode;
  }
}

export const SheduleBoard: React.FunctionComponent<SheduleBoardTime> = props => {
  const { currentDate } = props;
  const [date, setDate] = React.useState(currentDate);
  const [hover, setHover] = React.useState(0);
  const [rowVisibility, setRowVisibility] =
   React.useState([false, false, false, false, false, false]);
  const daysOfTheSelectedMonth: Array<Date> = getDaysOfSelectedMonth(
    date.getMonth(),
    date.getFullYear(),
  );
  const daysOfTheSurroundingMonths: SurroundingMonthsDate =
    getDaysOfSurroundingMonths(
      daysOfTheSelectedMonth[0],
      daysOfTheSelectedMonth.slice(-1)[0],
    );
  const combinedDates = combineDates(
    daysOfTheSelectedMonth,
    daysOfTheSurroundingMonths,
  );

  const bookings = getSelectedMonthBookings(combinedDates);
  const days = generateCalendarDates(combinedDates, bookings);

  const Title = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
  function setRowNumber(rowNumber: number) {
    const updatedVisibility = new Array(...rowVisibility);
    updatedVisibility[rowNumber] = !updatedVisibility[rowNumber];
    return updatedVisibility;
  }

  function currentMonthButtonIsDisabled(date: Date): boolean {
    return (
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    );
  }

  const Board =
    <div className="bvrBoard_main">
      <div className="bvrBoard_scheduleBoard">
        <div className="bvrBoard_header">
          <div className="bvrBoard_h_content">
            <div className="arrowButtons">
              <span
                className="arrow"
                onClick={() => {
                  setDate(changeMonth('BACK', date));
                }}
              >
                <button>&lt;</button>
              </span>
              <span
                className="arrow"
                onClick={() => {
                  setDate(changeMonth('FORWARD', date));
                }}
              >
                <button>&gt;</button>
              </span>
              <span
                className="today"
                onClick={() => {
                  setDate(changeMonth(undefined, date));
                }}
              >
                <button disabled={currentMonthButtonIsDisabled(date)}>Current</button>
              </span>
            </div>
            <div className="period">{Title}</div>
          </div>
        </div>
        <div className="bvrBoard_calendar">
          <div className="bvrBoard_c_content">
            <div className="weekDays">
              <ul>
                <li>{WEEK_DAYS.Monday}</li>
                <li>{WEEK_DAYS.Tuesday}</li>
                <li>{WEEK_DAYS.Wednesday}</li>
                <li>{WEEK_DAYS.Thuesday}</li>
                <li>{WEEK_DAYS.Friday}</li>
                <li>{WEEK_DAYS.Saturnday}</li>
                <li>{WEEK_DAYS.Sunday}</li>
              </ul>
            </div>
            <div className="calendar-body">
              <table>
                {days.map((row, i) =>
                  <tr className="bvrBoard_row" id={`${i}`} key={i}
                  >
                    {row.map((date, j) =>
                      <td
                        key={`${i}-${j}`}
                        id={`${i}-${j}`}
                        className={j === 5 || j === 6 ? 'day-off' : 'cell'}
                      >
                        <div className='cell-content'>
                          <span
                            className={
                              date.isTheItemOfTheSelectedMonth
                                ? 'inputDate'
                                : 'day-of-the-surrounding-month'
                            }
                          >
                            {date.day}
                          </span>
                          <div className="bvrBoard_bookings">
                            {date.bookings.map((booking, b) =>
                              <Tooltip
                                key={b}
                                content={booking.name}
                                background={booking.color}
                                color='white'
                                styles={booking.color === '#FFFFFF'
                                  ? { visibility: 'hidden' }
                                  : { visibility: 'visible' }}
                                // tipContentClassName='tooltip-box'
                              >
                                <div
                                  className={
                                    b >= 10 && (rowVisibility[i] === false)
                                      ? 'isUnreal' : 'booking'
                                  }
                                  key={`${i}-${j}-${b}`}
                                  id={`${i}-${j}-${b}`}
                                  style={booking.isHovered
                                    ? { backgroundColor: '#383050' }
                                    : { backgroundColor: booking.color,
                                      ...booking.color === '#FFFFFF' ? { visibility: 'hidden' }
                                        : { visibility: 'visible' } }}
                                  onClick={() => DataverseService.openForm(booking.id)}
                                  onMouseEnter={() => {
                                    changeColor(booking, bookings, 'Hover');
                                    setHover(hover + 1);
                                  }}
                                  onMouseLeave={() => {
                                    changeColor(booking, bookings, undefined);
                                    setHover(hover - 1);
                                  }}
                                >
                                  <div className="booking-row">
                                    <span className="booking-name">
                                      {booking.name}
                                    </span>
                                  </div>
                                </div>
                              </Tooltip>,
                            )}
                          </div>
                          <div className='bvrBoard_expander'>
                            <button className='button'
                              style={ date.bookings.length <= 2 ? { visibility: 'hidden' }
                                : { visibility: 'visible' } }
                              onClick={() => setRowVisibility(setRowNumber(i))}>
                              {
                                rowVisibility[i] === false
                                  ? 'Show More'
                                  : 'Show Less' }
                              <i className={
                                rowVisibility[i] === false
                                  ? 'bvrBoard_down'
                                  : 'bvrBoard_up'}></i>
                            </button>
                          </div>
                        </div>

                      </td>,
                    )}
                  </tr>,
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>;
  return Board;
};
