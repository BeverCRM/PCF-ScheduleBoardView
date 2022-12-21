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
  // store.dispatch(setSelectedMonthRecords(data));
}

export function fetchRecords(inputRecords: any) {
  // const dispatch = useAppDispatch();
  const data:Array<Record> = [];
  const schemaNames = store.getState().recordFieldSchemaNames;

  for (const ID in inputRecords) {
    const record = inputRecords[ID];
    console.log('1');
    const item: Record = {
      id: ID,
      name: record.getValue([schemaNames.name]),
      start: new Date(record.getValue([schemaNames.startDate])),
      end: new Date(record.getValue([schemaNames.endDate])),
      // start: new Date(schemaNames.startDate),
      // end: new Date(schemaNames.endDate),
      color: randomColor(),
      index: -1,
      isHovered: false,
    };

    data.push(item);
  }
  console.log(data);
  // store.dispatch(boardReducer.actions.setRecords(data));
  store.dispatch(setRecords(data));
}
