import { randomColor } from '../Utilities/utilities';
import { store, setRecords, setRecordFieldSchemaNames } from './Store';
import { Record } from './Types';

export function fetchRecordFieldSchemaNames(inputSchemaNames: any) {
  const schemaNames = {
    name: inputSchemaNames[0],
    startDate: inputSchemaNames[1],
    endDate: inputSchemaNames[2],
  };

  store.dispatch(setRecordFieldSchemaNames(schemaNames));
}

export function fetchSelectedMonthRecords(inputDate: any) {
  const data: Array<Record> = [];
  const { records } = store.getState();
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
  console.log('test');
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

    data.push(item);
  }
  store.dispatch(setRecords(data));
}
