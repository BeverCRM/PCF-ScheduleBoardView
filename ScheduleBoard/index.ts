/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { fetchRecords } from './store/services';
import { DataverseService } from './services/dataverseService';
import { ScheduleBoard } from './components/ScheduleBoard';
import { IDataverseService, Store } from './utilities/types';
import { configureStore } from '@reduxjs/toolkit';
import { boardReducer } from './store/store';

export class ScheduleBoardView
implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private _dataverseService: IDataverseService;
  private _store: Store;

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
  ): void {
    this._dataverseService = new DataverseService(context);
    this._store = configureStore({
      reducer: boardReducer.reducer,
    });
    this._dataverseService.setSchemaNames(this._store);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {

    if (context.parameters.DataSet.paging !== null &&
        context.parameters.DataSet.paging.hasNextPage) {
      context.parameters.DataSet.paging.setPageSize(5000);
      context.parameters.DataSet.paging.loadNextPage();
    }
    else {
      const { records } = context.parameters.DataSet;
      fetchRecords(records, this._store, context);
    }
    return React.createElement(ScheduleBoard, { _service: this._dataverseService,
      store: this._store,
      currentDate: new Date(),
    });
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
  }
}
