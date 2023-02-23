import { getValidColor } from '../utilities/utilities';
import { useAppSelector } from './hooks';
import { store, setRecords, setRecordFieldSchemaNames } from './store';
import { Record, SchemaNames } from '../utilities/types';

export function fetchRecordFieldSchemaNames(inputSchemaNames: Array<String | null>) {
  const schemaNames: SchemaNames = {
    name: <string>inputSchemaNames[0],
    startDate: <string>inputSchemaNames[1],
    endDate: <string>inputSchemaNames[2],
    color: <string>inputSchemaNames[3],
  };

  store.dispatch(setRecordFieldSchemaNames(schemaNames));
}

function recordInSelectedMonth(
  item: Record,
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
}) {
  const data: Record[] = [];
  const records = useAppSelector(store => store.records);
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

export function fetchRecords(inputRecords: InputRecords) {
  const data: Record[] = [];
  const schemaNames = store.getState().recordFieldSchemaNames;
  for (const ID in inputRecords) {
    const record = inputRecords[ID];
    const color = getValidColor(record, schemaNames);
    const item: Record = {
      id: ID,
      name: <string>record.getValue(schemaNames.name),
      start: new Date(<string>(record.getValue(schemaNames.startDate))).getTime(),
      end: new Date(<string>(record.getValue(schemaNames.endDate))).getTime(),
      color,
      index: -1,
    };

    if (item.start < item.end) {
      data.push(item);
    }
  }

  store.dispatch(setRecords(data));
}
