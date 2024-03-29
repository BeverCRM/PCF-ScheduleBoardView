import * as React from 'react';
import { changeDay, changeMonth } from '../services/scheduleBoardServices';
import { IViewOptions } from '../utilities/types';

interface IHeader {
    setDate: (date: Date) => void;
    option: string
    changeSize: () => void | null;
    title: string;
    setView: (view: IViewOptions) => void;
    date: Date;
    buttonName: string;
    currentButtonIsDisabled: boolean;
    viewOptions: IViewOptions;
}

export const Header: React.FC<IHeader> = props => {
  const { setDate, changeSize, title, setView, date, buttonName,
    currentButtonIsDisabled, option, viewOptions } = props;
  let changeMonthOrDay: (direction: string, date: Date) => Date;
  switch (option) {
    case 'day': {
      changeMonthOrDay = changeDay;
      break;
    }
    case 'month': {
      changeMonthOrDay = changeMonth;
    }
  }

  return (
    <div className="bvrBoard_header">
      <div className="bvrBoard_h_content">
        <div className="arrowButtons">
          <span
            className="arrow"
            onClick={() => {
              setDate(changeMonthOrDay('BACK', date));
              changeSize();
            }}
          >
            <button>&lt;</button>
          </span>
          <span
            className="arrow"
            onClick={() => {
              setDate(changeMonthOrDay('FORWARD', date));
              changeSize();
            }}
          >
            <button>&gt;</button>
          </span>
          <span
            className="today"
            onClick={() => {
              setDate(changeMonthOrDay('TODAY', date));
              changeSize();
            }}
          >
            <button disabled={currentButtonIsDisabled}>Today</button>
          </span>
          <span className="bvrBoard_viewChange"
            style={ viewOptions.daily ? { display: 'none' }
              : { display: 'contents' }}
            onClick={() => {
              setView(
                viewOptions,
              );
              changeSize();
            }}
          >
            <button>{buttonName}</button>
          </span>
        </div>
        <div className="period">{title}</div>
      </div>
    </div>
  );
};
