import { getValidColor } from '../utilities/utilities';
import { setRecords, setRecordFieldSchemaNames } from './store';
import { Booking, SchemaNames, Store } from '../utilities/types';
import { IInputs } from '../generated/ManifestTypes';

export function fetchRecordFieldSchemaNames(inputSchemaNames: (string | null)[], store: Store) {
  const schemaNames: SchemaNames = {
    name: <string>inputSchemaNames[0],
    startDate: <string>inputSchemaNames[1],
    endDate: <string>inputSchemaNames[2],
    color: <string>inputSchemaNames[3],
  };

  store.dispatch(setRecordFieldSchemaNames(schemaNames));
}

function recordInSelectedMonth(
  item: Booking,
  inputDate: {
  start: Date,
  end: Date,
}): boolean {
  return (
    (new Date(item.start) < inputDate.start && new Date(item.end) > inputDate.end) ||
    (new Date(item.start) >= inputDate.start && new Date(item.start) <= inputDate.end) ||
    (new Date(item.end) >= inputDate.start && new Date(item.end) <= inputDate.end)
  );
}

export function fetchSelectedMonthRecords(inputDate: {
  start: Date,
  end: Date,
}, records: Booking[]) {
  const data: Booking[] = [];
  records.forEach(item => {
    if (recordInSelectedMonth(item, inputDate)) {
      data.push(item);
    }
  });
  return data;
}

type InputRecords = {
  [id: string]: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
}

export function fetchRecords(inputRecords: InputRecords, store: Store,
  context: ComponentFramework.Context<IInputs>) {
  const data: Booking[] = [];
  const schemaNames = store.getState().recordFieldSchemaNames;
  for (const ID in inputRecords) {
    const record = inputRecords[ID];
    const color = getValidColor(record, schemaNames);
    const item: Booking = {
      id: ID,
      name: <string>record.getValue(schemaNames.name),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      start: context.formatting.formatUTCDateTimeToUserDate(record.getValue(schemaNames.startDate))
        .getTime(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      end: context.formatting.formatUTCDateTimeToUserDate(record.getValue(schemaNames.endDate))
        .getTime(),
      formattedStart: record.getFormattedValue(schemaNames.startDate),
      formattedEnd: record.getFormattedValue(schemaNames.endDate),
      color,
      index: -1,
    };

    if (item.start < item.end) {
      data.push(item);
    }
  }

  store.dispatch(setRecords(data));
}
