/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { fetchRecordFieldSchemaNames, fetchRecords } from './Store/Services';
import { setContext } from './Services/dataverseService';
import { SheduleBoard, SheduleBoardTime } from './Components/SheduleBoard';
import { BoardSpinner } from './Components/Spinner';

export class BvrScheduleBoardViewControl
implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private Component: ComponentFramework.ReactControl<IInputs, IOutputs>;
  private notifyOutputChanged: () => void;
  private recordFieldSchemaNames: Array<string | null>;

  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
  */

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

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
  */

  public updateView(
    context: ComponentFramework.Context<IInputs>,
  ): React.ReactElement {
    if (!context.parameters.DataSet.loading) {

      if (context.parameters.DataSet.paging !== null &&
        context.parameters.DataSet.paging.hasNextPage === true) {

        // set page size

        context.parameters.DataSet.paging.setPageSize(5000);

        // load next paging

        context.parameters.DataSet.paging.loadNextPage();

      }
      else {
        const { records } = context.parameters.DataSet;
        fetchRecords(records);

        const props: SheduleBoardTime = {
          currentDate: new Date(),
          calendarDays: [],
          onChange: this.notifyOutputChanged,
        };

        return React.createElement(SheduleBoard, props);
        // this.notifyOutputChanged();
        // return element;

      }
    }
    return React.createElement(BoardSpinner);

  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
  */

  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
  */

  public destroy(): void {
    // Add code to cleanup control if necessary
    console.log('destroy');

  }
}
