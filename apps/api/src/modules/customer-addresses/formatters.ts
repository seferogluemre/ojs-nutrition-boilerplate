import { City, CustomerAddress } from '#prisma/client';
import { BaseFormatter } from '../../utils';
import { customerAddressResponseSchema } from './dtos';
import { CustomerAddressShowResponse } from './types';

export abstract class CustomerAddressFormatter {
  static response(data: CustomerAddress & { city?: City }): CustomerAddressShowResponse {
    return BaseFormatter.convertData<CustomerAddressShowResponse>(data, customerAddressResponseSchema);
  }
} 