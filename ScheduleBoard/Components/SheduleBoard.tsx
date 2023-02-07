import * as React from 'react';
import { DailyView } from './DailyView';
import { MonthlyView } from './MonthlyView';
import { Provider } from 'react-redux';
import { store } from '../Store/Store';
import { CalendarDate } from '../Utilities/Types';

export interface ISheduleBoardProps {
  onChange: (date: Date | null) => void;
  currentDate: Date;
  calendarDays: CalendarDate[][];
}

export interface IViewOptions {
  monthly: boolean;
  weekly: boolean;
  daily: boolean;
}

export const SheduleBoard: React.FunctionComponent<ISheduleBoardProps> = props => {
  const { currentDate } = props;
  const defaultView: IViewOptions = {
    monthly: true,
    weekly: false,
    daily: false,
  };

  // fetchRecords(records);
  const [date, setDate] = React.useState(currentDate);
  const [view, setView] = React.useState(defaultView);

  if (view.daily === true) {
    return (
      <Provider store={store}>
        <DailyView date={date} setDate={setDate.bind(null)} setView={setView.bind(null)}/>
      </Provider>
    );
  }
  return (
    <Provider store={store}>
      <MonthlyView date={date} setDate={setDate.bind(null)} setView={setView.bind(null)}/>
    </Provider>
  );
};
