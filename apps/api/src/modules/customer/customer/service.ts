import { prisma } from '#core';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '#utils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import {
  generateCustomerTokenPair,
  invalidateCustomerSession,
  refreshCustomerTokenPair,
  verifyCustomerAccessToken,
} from '../../../utils/jwt';
import { AuthResponseType, LoginPayload, SignUpPayload } from '../auth/types';

export abstract class CustomerService {
  private static async handlePrismaError(
    error: unknown,
    context: 'find' | 'create' | 'update' | 'delete',
  ) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Customer not found');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Customer already exists');
      }
    }
    console.error(`Error in CustomerService.${context}:`, error);
    throw error;
  }

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
      throw this.handlePrismaError(error, 'create');
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
      throw this.handlePrismaError(error, 'find');
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
      throw this.handlePrismaError(error, 'find');
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
      throw this.handlePrismaError(error, 'find');
    }
  }

  static async logout(accessToken: string): Promise<{ message: string; success: boolean }> {
    try {
      return await invalidateCustomerSession(accessToken);
    } catch (error) {
      throw this.handlePrismaError(error, 'update');
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
      throw this.handlePrismaError(error, 'update');
    }
  }
}
