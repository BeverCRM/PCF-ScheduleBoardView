import { randomColor } from '../Utilities/utilities';
import { useAppSelector } from './hooks';
import { store, setRecords, setRecordFieldSchemaNames } from './Store';
import { Record, SchemaNames } from './Types';

export function fetchRecordFieldSchemaNames(inputSchemaNames: Array<String | null>) {
  const schemaNames: SchemaNames = {
    name: inputSchemaNames[0] as string,
    startDate: inputSchemaNames[1] as string,
    endDate: inputSchemaNames[2] as string,
  };

  store.dispatch(setRecordFieldSchemaNames(schemaNames));
}

export function fetchSelectedMonthRecords(inputDate: {
  start: Date,
  end: Date,
}) {
  const data: Record[] = [];
  const records = useAppSelector(store => store.records);
  records.forEach(item => {
    if (
      (item.start < inputDate.start && item.end > inputDate.end) ||
      (item.start >= inputDate.start && item.start <= inputDate.end) ||
      (item.end >= inputDate.start && item.end <= inputDate.end)
    ) {
      data.push(item);
    }
  });
  return data;
}

type InputRecords = {
  [id: string]: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
}

export function fetchRecords(inputRecords: InputRecords) {
  const data:Array<Record> = [];
  const schemaNames = store.getState().recordFieldSchemaNames;
  for (const ID in inputRecords) {
    const record = inputRecords[ID];
    const item: Record = {
      id: ID,
      name: <string>record.getValue(schemaNames.name),
      start: new Date(<string>(record.getValue(schemaNames.startDate))),
      end: new Date(<string>(record.getValue(schemaNames.endDate))),
      color: randomColor(),
      index: -1,
    };
    if (item.start.getTime() < item.end.getTime()) {
      data.push(item);
    }
  }

  store.dispatch(setRecords(data));
}
