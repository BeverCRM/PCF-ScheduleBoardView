import * as React from 'react';
import { changeDay, changeMonth } from '../Services/SheduleBoardServices';
import { IViewOptions } from './SheduleBoard';

interface IHeader {
    setDate: (date: Date) => void;
    option: string
    changeSize: () => void | null;
    title: string;
    setView: (view: IViewOptions) => void;
    date: Date;
    buttonName: string;
    currentButtonisDisabled: (date: Date) => boolean;
    viewOptions: IViewOptions;
}

export const Header: React.FunctionComponent<IHeader> = props => {
  const { setDate, changeSize, title, setView, date, buttonName,
    currentButtonisDisabled, option, viewOptions } = props;
  let changeMonthOrDay: (direction: string | undefined, date: Date) => Date;
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
              setDate(changeMonthOrDay(undefined, date));
              changeSize();
            }}
          >
            <button disabled={currentButtonisDisabled(date)}>Today</button>
          </span>
        </div>
        <div className="period">{title}</div>
        <div className="bvrBoard_viewChange"
          onClick={() => {
            setView(
              viewOptions,
            );
          }}
        >
          <button>{buttonName}</button>
        </div>
      </div>
    </div>
  );
};
