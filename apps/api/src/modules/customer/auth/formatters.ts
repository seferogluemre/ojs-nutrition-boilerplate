import { BaseFormatter } from '../../../utils';
import { TokenResponse } from './dtos';

export abstract class CustomerAuthFormatter {
  // Format auth response (signup/login)
  static authResponse(data: { customer: any; accessToken: string; refreshToken: string }) {
    return {
      customer: this.customerResponse(data.customer),
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  // Format token response (refresh)
  static tokenResponse(data: { accessToken: string; refreshToken: string }) {
    const convertedData = BaseFormatter.convertData<{ accessToken: string; refreshToken: string }>(
      data,
      TokenResponse,
    );
    return convertedData;
  }

  // Format logout response
  static logoutResponse() {
    return {
      message: 'Successfully logged out',
      success: true,
    };
  }

  // Format customer data (remove sensitive fields)
  static customerResponse(customer: any) {
    const { password, refreshToken, ...safeCustomer } = customer;
    return safeCustomer;
  }
}
