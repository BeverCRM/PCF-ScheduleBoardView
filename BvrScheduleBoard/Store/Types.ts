export type Record = {
  id: string;
  name: string;
  start: Date;
  end: Date;
  color: string;
  isUnreal: boolean;
};

export type UserAction =
  | SetRecordFieldSchemaNamesAction
  | SetSelectedMonthRecordsAction
  | SetRecordsAction;

export enum UserActionTypes {
  SetRecordFieldSchemaNamesAction = "setRecordFieldSchemaNames",
  SetSelectedMonthRecordsAction = "setSelectedMonthRecords",
  SetRecordsAction = "setRecords",
}

export interface SetRecordFieldSchemaNamesAction {
  type: UserActionTypes.SetRecordFieldSchemaNamesAction;
  payload: { name: ""; startDate: ""; endDate: "" };
}

export interface SetSelectedMonthRecordsAction {
  type: UserActionTypes.SetSelectedMonthRecordsAction;
  payload: Array<Record>;
}

export interface SetRecordsAction {
  type: UserActionTypes.SetRecordsAction;
  payload: Array<Record>;
}

export interface IState {
  records: Array<Record>;
  selectedMonthRecords: Array<Record>;
  recordFieldSchemaNames: { name: ""; startDate: ""; endDate: "" };
}
