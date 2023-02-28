import * as React from 'react';
import { ReactNode } from 'react';
import {
  generateCalendarDates,
  getSelectedMonthBookings,
} from '../services/scheduleBoardServices';
import {
  combineDates,
  getDaysOfSelectedMonth,
  getDaysOfSurroundingMonths,
} from '../utilities/dateUtilities';
import Tooltip from 'react-tooltip-lite';
import { IViewOptions } from './ScheduleBoard';
import { Header } from './Header';
import { MonthNames, WeekDays } from '../utilities/enums';
import { IDataverseService, IService, Store, SurroundingMonthsDate } from '../utilities/types';

declare module 'react-tooltip-lite' {
  interface TooltipProps {
    children: ReactNode;
  }
}

interface IMonthlyView extends IService<IDataverseService> {
  date: Date;
  setDate: (date: Date) => void;
  setView: (view: IViewOptions) => void;
  store: Store;
}

export const MonthlyView: React.FunctionComponent<IMonthlyView> = props => {
  const { date, setDate, setView, _service, store } = props;
  const calendarBodyRef = React.useRef<HTMLDivElement>(null);
  const daysOfTheSelectedMonth: Date[] = getDaysOfSelectedMonth(
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

  const bookings = getSelectedMonthBookings(combinedDates, store);
  const days = generateCalendarDates(combinedDates, bookings);

  const title = `${MonthNames[date.getMonth()]} ${date.getFullYear()}`;

  function currentMonthButtonIsDisabled(date: Date): boolean {
    return (
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    );
  }

  function changeSize() {
    setTimeout(() => {
      if (calendarBodyRef.current?.style.maxHeight) {
        calendarBodyRef.current.style.maxHeight = `${window.innerHeight - 300}px`;
      }
    }, 100);
  }

  React.useEffect(() => {
    window.addEventListener('resize', changeSize);
    return () => {
      window.removeEventListener('resize', changeSize);
    };
  }, []);

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
                {Object.keys(WeekDays).map((label, i) =>
                  <li key={i}>{label}</li>,
                )}
              </ul>
            </div>
            <div className="calendar-body" ref={calendarBodyRef}
              style={{ maxHeight: `${window.innerHeight - 300}px` }}
            >
              <table>
                <thead>
                  {days.map((row, i) =>
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
                                  content={
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                      <li>{booking.name}</li>
                                      <li>{new Date(booking.start).toLocaleTimeString([],
                                        { year: 'numeric', month: 'numeric', day: 'numeric',
                                          hour: '2-digit', minute: '2-digit' })}</li>
                                      <li>{new Date(booking.end).toLocaleTimeString([],
                                        { year: 'numeric', month: 'numeric', day: 'numeric',
                                          hour: '2-digit', minute: '2-digit' })}</li>
                                    </ul>
                                  }

                                  background={booking.color}
                                  color='white'
                                  styles={booking.color === '#FFFFFF'
                                    ? { visibility: 'hidden' }
                                    : { visibility: 'visible' }}
                                >
                                  <div
                                    className={
                                      b >= 5 ? 'isUnreal' : `booking booking${booking.id}`
                                    }
                                    key={`${i}-${j}-${b}`}
                                    style={{ backgroundColor: booking.color,
                                      ...booking.color === '#FFFFFF' ? { visibility: 'hidden' }
                                        : { visibility: 'visible' } }}
                                    onClick={() => _service.openForm(booking.id)}
                                    onMouseEnter={() => {
                                      const elems =
                                      document.getElementsByClassName(`booking${booking.id}`);
                                      for (let i = 0; i < elems.length; ++i) {
                                        elems[i].classList.add('bookingid');
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      const elems =
                                      document.getElementsByClassName(`booking${booking.id}`);
                                      for (let i = 0; i < elems.length; ++i) {
                                        elems[i].classList.remove('bookingid');
                                      }
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
                                onClick={() => {
                                  setView({ monthly: false, weekly: false, daily: true });
                                  setDate(date.value);
                                }}>
                                { date.bookings.length > 5
                                  ? 'Show More'
                                  : date.bookings.length >= 1
                                    ? 'Daily View'
                                    : '' }
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
