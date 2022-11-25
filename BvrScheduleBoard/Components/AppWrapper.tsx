import { Provider } from 'react-redux';
import { SheduleBoard, SheduleBoardTime } from './sheduleBoard';
import { store } from '../Store/store';
import * as React from 'react';

export const Wrapper = (props: SheduleBoardTime) =>

  <Provider store={store}>
    <SheduleBoard onChange={props.onChange}
      currentDate={new Date()} calendarDays= {props.calendarDays}/>
  </Provider>;
