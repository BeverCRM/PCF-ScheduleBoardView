import * as React from 'react';
import { fetchSelectedMonthRecords } from '../Store/Services';
import { IViewOptions } from './SheduleBoard';
import { openForm } from '../Services/dataverseService';
import { Header } from './Header';
import { getAbsoluteDate } from '../Utilities/dateUtilities';

interface IDailyView {
  date: Date;
  setDate: (date: Date) => void;
  setView: (view: IViewOptions) => void;
}
enum DAY_HOURS {
  zero = '00:00',
  one = '01:00',
  two = '02:00',
  three = '03:00',
  four = '04:00',
  five = '05:00',
  six = '06:00',
  seven = '07:00',
  eight = '08:00',
  nine = '09:00',
  ten = '10:00',
  eleven = '11:00',
  twelve = '12:00',
  thirteen = '13:00',
  fourteen = '14:00',
  fifteen = '15:00',
  sixteen = '16:00',
  seventeen = '17:00',
  eightteen = '18:00',
  nineteen = '19:00',
  twenty = '20:00',
  twentyOne = '21:00',
  twentyTwo = '22:00',
  twentyThree= '23:00',
}

export const DailyView: React.FunctionComponent<IDailyView> = props => {
  const { date, setDate, setView } = props;
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  const title = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const start = getAbsoluteDate(date, 'START');
  const end = getAbsoluteDate(date, 'END');

  const bookings = fetchSelectedMonthRecords({ start, end });

  function calculateBookingWidth(startDate: Date, endDate:Date): string {
    let startDateTime = 0;
    let endDateTime = 2400;
    if (startDate.getDate() === date.getDate() && startDate.getMonth() === date.getMonth()) {
      startDateTime = startDate.getHours() * 100 + startDate.getMinutes() / 0.6;
    }
    if (endDate.getDate() === date.getDate() && endDate.getMonth() === date.getMonth()) {
      endDateTime = endDate.getHours() * 100 + endDate.getMinutes() / 0.6;
    }
    return `${(endDateTime - startDateTime) / 24}%`;
  }

  function calculateBookingMargin(startDate:Date): string {
    if (startDate.getDate() === date.getDate() && startDate.getMonth() === date.getMonth()) {
      return `${(startDate.getHours() * 100 + startDate.getMinutes() / 0.6) / 24}%`;
    }
    return '0%';
  }

  function currentDayButtonIsDisabled(date: Date): boolean {
    return (
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear() &&
      date.getDate() === new Date().getDate()
    );
  }

  function changeSize() {
    setTimeout(() => {
      const w = document.getElementById('bvrBoard_calendar-body')?.clientWidth;
      const h = document.getElementById('bvrBoard_calendar-body')?.clientHeight;
      if (w !== null) {
        setWidth(w!);
      }
      if (h !== null) {
        setHeight(h!);
      }
    }, 100);
  }

  React.useEffect(() => {
    changeSize();
  }, []);

  React.useEffect(() => {
    window.addEventListener('resize', changeSize);
  }, []);

  React.useEffect(() => {
    window.addEventListener('minimize', changeSize);
  }, []);

  return (
    <div className="bvrBoard_main">
      <div className="bvrBoard_scheduleBoard">
        <Header setDate={setDate} date={date} option={'day'} changeSize={changeSize}
          title={title} setView={setView}
          viewOptions={{ monthly: true, weekly: false, daily: false }}
          buttonName={'Monthly View'} currentButtonisDisabled={currentDayButtonIsDisabled}
        />
        <div className="bvrBoard_calendar">
          <div className="bvrBoard_c_content">
            <div className="weekDays">
              <ul>
                {Object.values(DAY_HOURS).map((label, i) =>
                  <li key={i}>{label}</li>,
                )}
              </ul>
            </div>
            <div className="calendar-body" id='bvrBoard_calendar-body'
              style={{ maxHeight: `${window.innerHeight - 300}px` }}
            >
              <div id='bvrBoard_verlicallines'
                style={
                  { position: 'absolute',
                    height: `${height}px`,
                    width: `${width}px`,
                  }
                }
              >
                {Object.values(DAY_HOURS).map((label, i) =>
                  <div className="bvrBoard_vertical"
                    style={{ left: `${100 * i / 24}%` }}
                    key = {i}
                  />,
                )}
                <div className="bvrBoard_vertical"
                  style={{ left: `99.9%` }}
                />
              </div>
              <div className="bvrBoard_bookings">
                <table>
                  <tbody>
                    {bookings.map((booking, j) =>
                      <tr key={j}
                        className={ 'booking'}
                        id = {`booking${j}`}
                        style={
                          { backgroundColor: booking.color,
                            width: calculateBookingWidth(booking.start, booking.end),
                            marginLeft: calculateBookingMargin(booking.start) }}
                        onClick={() => openForm(booking.id)}
                        onMouseEnter={() => {
                          document.getElementById(`booking${j}`)!.style.background = '#383050';
                        }}
                        onMouseLeave={() => {
                          document.getElementById(`booking${j}`)!.style.background = booking.color;
                        }}
                      >
                        <td className="booking-row">
                          <span className="booking-name">
                            {booking.name}
                          </span>
                        </td>
                      </tr>,
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
