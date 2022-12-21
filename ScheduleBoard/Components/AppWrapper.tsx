import { Provider } from 'react-redux';
import { SheduleBoard, SheduleBoardTime } from './SheduleBoard';
import { store } from '../Store/Store';
import * as React from 'react';

export const Wrapper = (props: SheduleBoardTime) =>

  <Provider store={store}>
    <SheduleBoard onChange={props.onChange}
      currentDate={new Date()} calendarDays= {props.calendarDays}/>
  </Provider>;
