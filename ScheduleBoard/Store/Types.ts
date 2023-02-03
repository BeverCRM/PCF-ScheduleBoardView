export type SurroundingMonthsDate = {
  previousMonthDays: Date[],
  nextMonthDays: Date[],
};

export type CalendarDate = {
  value: Date,
  day: string,
  isTheItemOfTheSelectedMonth: boolean,
  bookings: Array<Record>,
};

export type Record = {
  id: string,
  name: string,
  start: Date,
  end: Date,
  color: string,
  index: number,
};

export interface IState {
  records: Array<Record>,
  selectedMonthRecords: Array<Array<CalendarDate>>,
  recordFieldSchemaNames: { name: ''; startDate: ''; endDate: '' },
}

export type SchemaNames = { name: ''; startDate: ''; endDate: '' };
