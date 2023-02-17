import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarDate, IState, SchemaNames, Record } from '../utilities/types';

const initialState: IState = {
  records: new Array<Record>(),
  selectedMonthRecords: new Array<Array<CalendarDate>>(),
  recordFieldSchemaNames: { name: '', startDate: '', endDate: '' },
};

export const boardReducer = createSlice({
  name: 'Board',
  initialState,
  reducers: {
    setRecordFieldSchemaNames: (state, action: PayloadAction<SchemaNames>) => {
      state.recordFieldSchemaNames = action.payload;
    },
    setRecords: (state, action: PayloadAction<Array<Record>>) => {
      state.records = action.payload;
    },
  },
});

export const { setRecordFieldSchemaNames, setRecords } =
boardReducer.actions;

export type AppDespatch = typeof store.dispatch;
export type RootState = ReturnType <typeof store.getState>;

export const store = configureStore({
  reducer: boardReducer.reducer,
});
