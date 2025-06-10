import { Value } from '@sinclair/typebox/value';

export abstract class BaseFormatter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static convertData<ReturnType extends object>(data: any, dto: any) {
    const clonedData = { ...data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanData = Value.Clean(dto, clonedData) as any;

    return cleanData as ReturnType;
  }
}
