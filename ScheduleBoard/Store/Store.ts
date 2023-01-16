import { configureStore, createSlice, getDefaultMiddleware, PayloadAction } from '@reduxjs/toolkit';
import { IState } from './Types';
import { Record } from './Types';
import { setAutoFreeze } from 'immer';
import { CalendarDate } from '../Utilities/dateUtilities';

const defaultState: IState = {
  records: [],
  selectedMonthRecords: new Array<Array<CalendarDate>>(),
  recordFieldSchemaNames: { name: '', startDate: '', endDate: '' },
};

type SchemaNames = { name: ''; startDate: ''; endDate: '' };

export const boardReducer = createSlice({
  name: 'Board',
  initialState: defaultState,
  reducers: {
    setRecordFieldSchemaNames: (state, action: PayloadAction<SchemaNames>) => {
      state.recordFieldSchemaNames = action.payload;
    },
    setSelectedMonthRecords: (state, action: PayloadAction<Array<Array<CalendarDate>>>) => {
      state.selectedMonthRecords = action.payload;
    },
    setRecords: (state, action: PayloadAction<Array<Record>>) => {
      state.records = action.payload;
    },
  },
});

export const { setSelectedMonthRecords, setRecordFieldSchemaNames, setRecords } =
boardReducer.actions;

export type AppDespatch = typeof store.dispatch;
export type RootState = ReturnType <typeof store.getState>;

setAutoFreeze(false);
export const store = configureStore({
  reducer: boardReducer.reducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
