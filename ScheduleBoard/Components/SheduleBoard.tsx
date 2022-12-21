import * as React from 'react';
import { CalendarDate } from '../Utilities/dateUtilities';
import { DailyView } from './DailyView';
import { MonthlyView } from './MonthlyView';

export interface SheduleBoardTime {
  onChange: (date: Date | null) => void;
  currentDate: Date;
  calendarDays: Array<Array<CalendarDate>>;
}

export interface IViewOptions {
  monthly: boolean;
  weekly: boolean;
  daily: boolean;
}

export const SheduleBoard: React.FunctionComponent<SheduleBoardTime> = props => {
  const { currentDate } = props;
  const defaultView: IViewOptions = {
    monthly: true,
    weekly: false,
    daily: false,
  };
  const [date, setDate] = React.useState(currentDate);
  const [view, setView] = React.useState(defaultView);

  function chnageDate(date: Date) {
    setDate(date);
  }

  function chnageview(view:IViewOptions) {
    setView(view);
  }

  if (view.monthly === true) {
    return (
      <MonthlyView date={date} setDate={chnageDate} setView={chnageview}/>
    );
  }
  if (view.daily === true) {
    return (
      <DailyView date={date} setDate={chnageDate} setView={chnageview}/>
    );
  }
  return (
    <MonthlyView date={date} setDate={chnageDate} setView={chnageview}/>
  );
};
