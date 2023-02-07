import { configureStore, createSlice, getDefaultMiddleware, PayloadAction } from '@reduxjs/toolkit';
import { CalendarDate, IState, SchemaNames, Record } from '../utilities/types';
import { setAutoFreeze } from 'immer';

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
