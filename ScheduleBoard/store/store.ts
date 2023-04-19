import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IState, SchemaNames, Booking } from '../utilities/types';

const initialState: IState = {
  records: [],
  recordFieldSchemaNames: { name: '', startDate: '', endDate: '', color: '' },
};

export const boardReducer = createSlice({
  name: 'Board',
  initialState,
  reducers: {
    setRecordFieldSchemaNames: (state, action: PayloadAction<SchemaNames>) => {
      state.recordFieldSchemaNames = action.payload;
    },
    setRecords: (state, action: PayloadAction<Booking[]>) => {
      state.records = action.payload;
    },
  },
});

export const { setRecordFieldSchemaNames, setRecords } =
boardReducer.actions;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: boardReducer.reducer,
});
