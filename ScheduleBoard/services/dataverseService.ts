import { IInputs } from '../generated/ManifestTypes';
import { fetchRecordFieldSchemaNames } from '../store/services';
import { IDataverseService, Store } from '../utilities/types';

export class DataverseService implements IDataverseService {
  private _context: ComponentFramework.Context<IInputs>;

  constructor(context: ComponentFramework.Context<IInputs>) {
    this._context = context;
  }

  isDatasetLoading(): boolean {
    return this._context.parameters.DataSet.loading;
  }

  public openForm(recordId: string): void {
    const _targetEntityType = this._context.parameters.DataSet.getTargetEntityType();
    const entityFormOptions = {
      entityId: recordId,
      entityName: _targetEntityType,
      openInNewWindow: false,
    };
    this._context.navigation.openForm(entityFormOptions);
  }

  public setSchemaNames(store: Store): void {
    const recordFieldSchemaNames = [
      this._context.parameters.name.raw,
      this._context.parameters.startdate.raw,
      this._context.parameters.enddate.raw,
      this._context.parameters.color.raw,
    ];
    fetchRecordFieldSchemaNames(recordFieldSchemaNames, store);
  }

}
