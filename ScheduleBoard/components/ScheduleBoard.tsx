import * as React from 'react';
import { DailyView } from './DailyView';
import { MonthlyView } from './MonthlyView';
import { Provider } from 'react-redux';
import { IScheduleBoardProps } from '../utilities/types';
import { BoardSpinner } from './Spinner';

export interface IViewOptions {
  monthly: boolean;
  weekly: boolean;
  daily: boolean;
}

export const ScheduleBoard: React.FunctionComponent<IScheduleBoardProps> = props => {
  const { currentDate, _service, store } = props;
  const defaultView: IViewOptions = {
    monthly: true,
    weekly: false,
    daily: false,
  };

  // fetchRecords(records);
  const [date, setDate] = React.useState(currentDate);
  const [view, setView] = React.useState(defaultView);

  if (_service.isDatasetLoading()) {
    return (
      <BoardSpinner/>);
  }

  if (view.daily === true) {
    return (
      <Provider store={store}>
        <DailyView date={date} setDate={setDate} setView={setView}
          _service={_service} store={store}/>
      </Provider>
    );
  }
  return (
    <Provider store={store}>
      <MonthlyView date={date} setDate={setDate} setView={setView}
        _service={_service} store={store}/>
    </Provider>
  );
};
