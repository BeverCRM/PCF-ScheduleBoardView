import { AnyAction, EnhancedStore, ThunkMiddleware } from '@reduxjs/toolkit';

export type SurroundingMonthsDate = {
  previousMonthDays: Date[];
  nextMonthDays: Date[];
};

export type CalendarDate = {
  value: Date;
  day: string;
  isTheItemOfTheSelectedMonth: boolean;
  bookings: Booking[];
};

export type Booking = {
  id: string;
  name: string;
  start: number;
  end: number;
  formattedStart: string;
  formattedEnd: string;
  color: string;
  index: number;
};

export type SchemaNames = { name: string, startDate: string, endDate: string, color: string };

export type Store =
EnhancedStore<IState, AnyAction, [ThunkMiddleware<IState, AnyAction, undefined>]>;

export interface IState {
  records: Booking[];
  recordFieldSchemaNames: SchemaNames;
}

export interface IDataverseService {
  openForm(recordId: string): void;
  setSchemaNames(store: Store): void;
  isDatasetLoading(): boolean;
}

export interface IViewOptions {
  monthly: boolean;
  weekly: boolean;
  daily: boolean;
}
