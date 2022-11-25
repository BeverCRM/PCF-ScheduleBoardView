import { CalendarDate } from '../Utilities/dateUtilities';

export type Record = {
  id: string;
  name: string;
  start: Date;
  end: Date;
  color: string;
  index: number;
  isHovered: boolean;
};

export interface IState {
  records: Array<Record>;
  selectedMonthRecords: Array<Array<CalendarDate>>;
  recordFieldSchemaNames: { name: ''; startDate: ''; endDate: '' };
}
