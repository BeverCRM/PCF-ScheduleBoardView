/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { fetchRecordFieldSchemaNames, fetchRecords } from './store/services';
import { setContext } from './services/dataverseService';
import { SheduleBoard, IScheduleBoardProps } from './components/SheduleBoard';
import { BoardSpinner } from './components/Spinner';

export class ScheduleBoardView
implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private Component: ComponentFramework.ReactControl<IInputs, IOutputs>;
  private notifyOutputChanged: () => void;
  private recordFieldSchemaNames: Array<string | null>;

  constructor() {}

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.recordFieldSchemaNames = context.parameters.DataSet.columns.map(
      item => item.name,
    );
    this.recordFieldSchemaNames = [
      context.parameters.name.raw,
      context.parameters.startdate.raw,
      context.parameters.enddate.raw,
    ];
    fetchRecordFieldSchemaNames(this.recordFieldSchemaNames);
    setContext(context);
  }

  public updateView(
    context: ComponentFramework.Context<IInputs>,
  ): React.ReactElement {
    if (!context.parameters.DataSet.loading) {
      if (context.parameters.DataSet.paging !== null &&
        context.parameters.DataSet.paging.hasNextPage === true) {
        context.parameters.DataSet.paging.setPageSize(5000);
        context.parameters.DataSet.paging.loadNextPage();
      }
      else {
        const { records } = context.parameters.DataSet;
        fetchRecords(records);

        const props: IScheduleBoardProps = {
          currentDate: new Date(),
        };

        return React.createElement(SheduleBoard, props);
      }
    }
    return React.createElement(BoardSpinner);

  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
  }
}
