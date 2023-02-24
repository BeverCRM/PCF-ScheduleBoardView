export type SurroundingMonthsDate = {
  previousMonthDays: Date[];
  nextMonthDays: Date[];
};

export type CalendarDate = {
  value: Date;
  day: string;
  isTheItemOfTheSelectedMonth: boolean;
  bookings: Record[];
};

export type Record = {
  id: string;
  name: string;
  start: number;
  end: number;
  color: string;
  index: number;
};

export type SchemaNames = { name: string, startDate: string, endDate: string, color: string };

export interface IState {
  records: Record[];
  recordFieldSchemaNames: SchemaNames;
}
