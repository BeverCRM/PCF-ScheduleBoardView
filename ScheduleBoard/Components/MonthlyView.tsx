import * as React from 'react';
import { ReactNode } from 'react';
import {
  generateCalendarDates,
  changeColor,
  getSelectedMonthBookings,
} from '../Services/SheduleBoardServices';
import { openForm } from '../Services/dataverseService';
import {
  CalendarDate,
  combineDates,
  getDaysOfSelectedMonth,
  getDaysOfSurroundingMonths,
  SurroundingMonthsDate,
} from '../Utilities/dateUtilities';
import Tooltip from 'react-tooltip-lite';
import { IViewOptions } from './SheduleBoard';
import { Header } from './Header';

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
    Thursday = 'Thu',
    Friday = 'Fri',
    Saturday = 'Sat',
    Sunday = 'Sun',
  }

  declare module 'react-tooltip-lite' {
      interface TooltipProps {
      children: ReactNode;
    }
  }

interface IMonthlyView {
    date: Date;
    setDate: (date: Date) => void;
    setView: (view: IViewOptions) => void;
  }

export const MonthlyView: React.FunctionComponent<IMonthlyView> = props => {
  const { date, setDate, setView } = props;
  const [hover, setHover] = React.useState(0);
  const [monthDays, setDays] = React.useState(new Array<Array<CalendarDate>>());

  if (monthDays[0] === undefined || monthDays[1][0].value.getMonth() !== date.getMonth()) {
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
    setDays(days);
  }
  const title = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;

  function currentMonthButtonIsDisabled(date: Date): boolean {
    return (
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    );
  }

  /* React.useEffect(() => {
    setDays(days);
  }, []); */

  return (
    <div className="bvrBoard_main">
      <div className="bvrBoard_scheduleBoard">
        <Header setDate={setDate} date={date} option={'month'} changeSize={ () => null}
          title={title} setView={setView}
          viewOptions={{ monthly: false, weekly: false, daily: true }}
          buttonName={'Daily View'} currentButtonisDisabled={currentMonthButtonIsDisabled}
        />
        <div className="bvrBoard_calendar">
          <div className="bvrBoard_c_content">
            <div className="weekDays">
              <ul>
                {Object.keys(WEEK_DAYS).map((label, i) =>
                  <li key={i}>{label}</li>,
                )}
              </ul>
            </div>
            <div className="calendar-body"
              style={{ maxHeight: `${window.innerHeight - 300}px` }}
            >
              <table>
                <thead>
                  {monthDays.map((row, i) =>
                    <tr className="bvrBoard_row" id={`${i}`} key={i}
                    >
                      {row.map((date, j) =>
                        <td
                          key={`${i}-${j}`}
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
                                >
                                  <div
                                    className={
                                      b >= 5 ? 'isUnreal' : 'booking'
                                    }
                                    key={`${i}-${j}-${b}`}
                                    style={booking.isHovered
                                      ? { backgroundColor: '#383050' }
                                      : { backgroundColor: booking.color,
                                        ...booking.color === '#FFFFFF' ? { visibility: 'hidden' }
                                          : { visibility: 'visible' } }}
                                    onClick={() => openForm(booking.id)}
                                    onMouseEnter={() => {
                                      changeColor(booking, date.bookings, 'Hover');
                                      setHover(hover + 1);
                                    }}
                                    onMouseLeave={() => {
                                      changeColor(booking, date.bookings, undefined);
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
                                style={ date.bookings.length <= 5 ? { visibility: 'hidden' }
                                  : { visibility: 'visible' } }
                                onClick={() => {
                                  setView({ monthly: false, weekly: false, daily: true });
                                  setDate(date.value);
                                }}>
                               Show More
                              </button>
                            </div>
                          </div>
                        </td>,
                      )}
                    </tr>,
                  )}
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
