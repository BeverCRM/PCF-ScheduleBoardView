import { store } from "./Store";
import { Record } from "./Types";

export function randomColor(): string {
  const randomInt = (min: number, max: number): number => {
    return (Math.random() * (max - min + 1) + min) << 0;
  };

  const H = randomInt(0, 360);
  const S = randomInt(45, 65);
  const L = randomInt(45, 65);

  return `hsl(${H}, ${S}%, ${L}%)`;
}

export function FetchRecordFieldSchemaNames(inputSchemaNames: any) {
  const schemaNames = {
    name: inputSchemaNames[0],
    startDate: inputSchemaNames[1],
    endDate: inputSchemaNames[2],
  };

  store.dispatch({ type: "setRecordFieldSchemaNames", payload: schemaNames });
}

export function FetchSelectedMonthRecords(inputDate: any) {
  const data = new Array<Record>();
  const records = store.getState().records;
  records.forEach((item) => {
    if (
      (item.start < inputDate.start && item.end > inputDate.end) ||
      (item.start >= inputDate.start && item.start <= inputDate.end) ||
      (item.end >= inputDate.start && item.end <= inputDate.end)
    )
      data.push(item);
  });

  store.dispatch({ type: "setSelectedMonthRecords", payload: data });
}

export function FetchRecords(inputRecords: any) {
  const data = new Array<Record>();
  const schemaNames = store.getState().recordFieldSchemaNames;

  for (const ID in inputRecords) {
    //const record = inputRecords[ID]
    const item: Record = {
      id: ID,
      name: schemaNames.name,
      //start: new Date(record.getValue([schemaNames.startDate])),
      //end: new Date(record.getValue([schemaNames.endDate])),
      start: new Date(schemaNames.startDate),
      end: new Date(schemaNames.endDate),
      color: randomColor(),
      isUnreal: false,
    };

    data.push(item);
  }

  store.dispatch({ type: "setSelectedMonthRecords", payload: data });
}
