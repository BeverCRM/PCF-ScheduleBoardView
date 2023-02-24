import { SchemaNames } from './types';

function randomColor(): string {
  const randomInt = (min: number, max: number)
  : number => (Math.random() * (max - min + 1) + min) << 0;

  const H = randomInt(0, 360);
  const S = randomInt(45, 65);
  const L = randomInt(45, 65);

  return `hsl(${H}, ${S}%, ${L}%)`;
}

export function getValidColor(
  record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord,
  schemaNames: SchemaNames): string {
  const isHexCode = /[0-9A-F]{6}$/i;
  const startWithHash = /^#/;
  let color = <string>(record.getValue(schemaNames.color));
  if (isHexCode.test(color)) {
    if (!startWithHash.test(color)) {
      color = `#${color}`;
    }
  }
  else {
    color = randomColor();
  }

  return color;
}
