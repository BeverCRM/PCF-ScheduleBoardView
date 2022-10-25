/* eslint-disable react/prop-types */
import { Provider } from "react-redux"
import { SheduleBoard,SheduleBoradTime } from "./SheduleBoard"
import { store} from "../Store/Store"
import React = require("react")


export const Wrapper = (props: SheduleBoradTime) => {
 return(   
  <Provider store={store}>
    <SheduleBoard onChange={props.onChange} currentDate={new Date()} calendarDays= {props.calendarDays}/>
  </Provider>)
}