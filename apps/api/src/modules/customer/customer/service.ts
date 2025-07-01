import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '#utils';

import { prisma } from '#core';
import { HandleError } from '#shared/error/handle-error';
import {
  generateCustomerTokenPair,
  invalidateCustomerSession,
  refreshCustomerTokenPair
} from '../../../utils/jwt';
import { AuthResponseType, LoginPayload, SignUpPayload } from '../auth/types';

export abstract class CustomerService {

  static async signUp(payload: SignUpPayload): Promise<AuthResponseType> {
    try {
      const { password, firstName, lastName, email, username } = payload;

      // Check if customer already exists
      const existingCustomer = await prisma.customer.findUnique({
        where: { email },
      });

      if (existingCustomer) {
        throw new ConflictException('Customer with this email already exists');
      }

      // Check if username already exists
      const existingUsername = await prisma.customer.findUnique({
        where: { username },
      });

      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }

      // Hash password properly with secure settings
      const hashedPassword = await Bun.password.hash(password, {
        algorithm: 'bcrypt',
        cost: 12, // Secure cost for production
      });

      const fullName = `${firstName} ${lastName}`;

      const customer = await prisma.customer.create({
        data: {
          email,
          firstName,
          lastName,
          name: fullName,
          username,
          password: hashedPassword,
        },
      });

      // Generate token pair
      const { accessToken, refreshToken } = generateCustomerTokenPair({
        id: customer.id.toString(),
        role: 'customer',
      });

      // Update customer with refresh token
      const updatedCustomer = await prisma.customer.update({
        where: { id: customer.id },
        data: { refreshToken },
      });

      return {
        customer: updatedCustomer,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customer', 'create');
      throw error;
    }
  }

  static async findByEmail(email: string) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { email },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      return customer;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customer', 'find');
      throw error;
    }
  }

  static async findById(id: number) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      return customer;
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customer', 'find');
      throw error;
    }
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await Bun.password.verify(plainPassword, hashedPassword);
  }

  static async login(payload: LoginPayload): Promise<AuthResponseType> {
    try {
      const { email, password } = payload;

      // Find customer by email
      const customer = await this.findByEmail(email);

      // Verify password
      const isValidPassword = await this.verifyPassword(password, customer.password);

      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate token pair
      const { accessToken, refreshToken } = generateCustomerTokenPair({
        id: customer.id.toString(),
        role: 'customer',
      });

      // Update refresh token in database
      await prisma.customer.update({
        where: { id: customer.id },
        data: { refreshToken },
      });

      return {
        customer,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customer', 'find');
      throw error;
    }
  }

  static async logout(accessToken: string): Promise<{ message: string; success: boolean }> {
    try {
      return await invalidateCustomerSession(accessToken);
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customer', 'update');
      throw error;
    }
  }

  static async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }

      return await refreshCustomerTokenPair(refreshToken);
    } catch (error) {
      await HandleError.handlePrismaError(error, 'customer', 'update');
      throw error;
    }
  }
}
