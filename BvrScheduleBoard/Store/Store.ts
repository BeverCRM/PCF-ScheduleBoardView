/* eslint-disable @typescript-eslint/no-empty-function */
import {configureStore} from '@reduxjs/toolkit';
import { IState, Record, UserAction, UserActionTypes } from './Types';


const defaultState: IState = {
  records: new Array<Record>(),
  selectedMonthRecords: new Array<Record>(),
  recordFieldSchemaNames: { name: "", startDate: "", endDate: "" },
};


const reducer = (state = defaultState, action: UserAction): IState => {
  switch (action.type) {
    case UserActionTypes.SetRecordFieldSchemaNamesAction:
      console.log(action.payload);
      return { records:state.records,selectedMonthRecords:state.selectedMonthRecords, recordFieldSchemaNames: action.payload };
    case UserActionTypes.SetSelectedMonthRecordsAction:
      return { ...state, selectedMonthRecords: action.payload };
    case UserActionTypes.SetRecordsAction:
      return { ...state, records: action.payload };
    default:
      return state;
  }
};


export const store = configureStore({reducer});