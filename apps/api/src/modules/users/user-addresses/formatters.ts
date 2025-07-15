
import { UserAddress } from '#prisma/index';
import { BaseFormatter } from '#utils';
import { userAddressResponseSchema } from './dtos';
import { UserAddressShowResponse } from './types';


export abstract class UserAddressFormatter {

  static response(data: UserAddress & { city?: any }): UserAddressShowResponse {
    return BaseFormatter.convertData<UserAddressShowResponse>(data, userAddressResponseSchema);
  }
} 