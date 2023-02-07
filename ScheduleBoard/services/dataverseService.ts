import { IInputs } from '../generated/ManifestTypes';

let _context: ComponentFramework.Context<IInputs>;
let _targetEntityType: string;

export function setContext(context: ComponentFramework.Context<IInputs>) {
  _context = context;
  _targetEntityType = _context.parameters.DataSet.getTargetEntityType();
}

export function openForm(recordId: string) {
  const entityFormOptions = {
    entityId: recordId,
    entityName: _targetEntityType,
    openInNewWindow: false,
  };

  _context.navigation.openForm(entityFormOptions);
}