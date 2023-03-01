import * as React from 'react';
import { fetchSelectedMonthRecords } from '../store/services';
import { Header } from './Header';
import { getAbsoluteDate } from '../utilities/dateUtilities';
import { DayHours } from '../utilities/enums';
import Tooltip from 'react-tooltip-lite';
import { IDataverseService, IViewOptions, Store } from '../utilities/types';

interface IDailyView {
  date: Date;
  setDate: (date: Date) => void;
  setView: (view: IViewOptions) => void;
  store: Store;
  _service: IDataverseService;
}

export const DailyView: React.FunctionComponent<IDailyView> = props => {
  const { date, setDate, setView, _service, store } = props;
  const verticalLinesRef = React.useRef<HTMLDivElement>(null);
  const calendarBodyRef = React.useRef<HTMLDivElement>(null);

  const title = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const start = getAbsoluteDate(date, 'START');
  const end = getAbsoluteDate(date, 'END');

  const bookings = fetchSelectedMonthRecords({ start, end }, store);

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
      if (calendarBodyRef.current?.style.maxHeight) {
        calendarBodyRef.current.style.maxHeight = `${window.innerHeight - 300}px`;
      }
      if (verticalLinesRef.current?.style.height) {
        verticalLinesRef.current.style.height =
      `${document.getElementById('bvrBoard_calendar-body')?.clientHeight}px`;
        !document.getElementById('bvrBoard_calendar-body')?.style.maxHeight;
      }
      if (verticalLinesRef.current?.style.width) {
        verticalLinesRef.current.style.width =
      `${document.getElementById('bvrBoard_calendar-body')?.clientWidth}px`;
      }
    }, 100);
  }

  React.useEffect(() => {
    window.addEventListener('resize', changeSize);
    changeSize();
    return () => {
      window.removeEventListener('resize', changeSize);
    };
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
                {Object.values(DayHours).map((label, i) =>
                  <li key={i}>{label}</li>,
                )}
              </ul>
            </div>
            <div className="calendar-body" id='bvrBoard_calendar-body' ref={calendarBodyRef}
              style={{ maxHeight: `${window.innerHeight - 300}px` }}
            >
              <div id='bvrBoard_verlicallines' ref={verticalLinesRef}
                style={
                  { position: 'absolute',
                    height: `0px`,
                    width: `0px`,
                  }
                }
              >
                {Object.values(DayHours).map((label, i) =>
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
                        style={ calculateBookingWidth(new Date(booking.start),
                          new Date(booking.end)) === '0%'
                          ? { display: 'none' }
                          : { backgroundColor: booking.color,
                            width: calculateBookingWidth(new Date(booking.start),
                              new Date(booking.end)),
                            marginLeft: calculateBookingMargin(new Date(booking.start)),
                            height: '21px',
                            display: 'flex',
                          }}
                        onClick={() => _service.openForm(booking.id)}
                        onMouseEnter={ e => {
                          e.currentTarget.style.background = '#383050';
                        }}
                        onMouseLeave={ e => {
                          e.currentTarget.style.background = booking.color;
                        }}
                      >
                        <div style={{ width: '100%' }} id={'booking'}>
                          <Tooltip
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
                            <td className="booking-row">
                              <span className="booking-name">
                                {booking.name}
                              </span>
                            </td>
                          </Tooltip>
                        </div>
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
