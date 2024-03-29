import * as React from 'react';
import { DailyView } from './DailyView';
import { MonthlyView } from './MonthlyView';
import { Provider } from 'react-redux';
import { BoardSpinner } from './Spinner';
import { IDataverseService, IViewOptions, Store } from '../utilities/types';

interface IScheduleBoardProps {
  currentDate: Date;
  store: Store;
  _service: IDataverseService;
}

const defaultView: IViewOptions = {
  monthly: true,
  weekly: false,
  daily: false,
};

export const ScheduleBoard: React.FC<IScheduleBoardProps> = props => {
  const { currentDate, _service, store } = props;

  const [date, setDate] = React.useState(currentDate);
  const [view, setView] = React.useState(defaultView);

  if (_service.isDatasetLoading()) {
    return <BoardSpinner />;
  }

  if (view.daily) {
    return (
      <Provider store={store}>
        <DailyView date={date} setDate={setDate} setView={setView}
          _service={_service} />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <MonthlyView date={date} setDate={setDate} setView={setView}
        _service={_service} />
    </Provider>
  );
};
