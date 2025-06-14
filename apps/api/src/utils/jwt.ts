import { prisma } from '#core';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';
import { sign, verify } from 'jsonwebtoken';

// Initialize Better Auth with Prisma adapter
const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  basePath: '/auth',
  baseURL: process.env.APP_URL ?? 'http://localhost:3000',
  url: process.env.APP_URL,
  trustedOrigins: [process.env.APP_URL!, process.env.API_URL!],
  domain: process.env.APP_DOMAIN,
  plugins: [openAPI()],
});

// Auth Payload interfaces
export interface AccessTokenPayload {
  id: string;
  role: string;
}

export interface RefreshTokenPayload {
  id: string;
}

interface SessionResponse {
  token: string;
  userId: string;
  data: {
    role?: string;
    [key: string]: any;
  };
}

// JWT secrets
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-customer-access-token';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your-secret-key-for-customer-refresh-token';

// Token generation
export const generateAccessToken = async (payload: AccessTokenPayload): Promise<string> => {
  try {
    const response = await fetch(`${process.env.APP_URL}/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: payload.id,
        data: { role: payload.role },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate access token');
    }

    const data = (await response.json()) as SessionResponse;
    return data.token;
  } catch (error) {
    throw new Error('Failed to generate access token');
  }
};

export const generateRefreshToken = async (payload: RefreshTokenPayload): Promise<string> => {
  try {
    const response = await fetch(`${process.env.APP_URL}/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: payload.id,
        data: {},
        type: 'refresh',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate refresh token');
    }

    const data = (await response.json()) as SessionResponse;
    return data.token;
  } catch (error) {
    throw new Error('Failed to generate refresh token');
  }
};

// Token verification
export const verifyAccessToken = async (token: string): Promise<AccessTokenPayload> => {
  try {
    const response = await fetch(`${process.env.APP_URL}/auth/session/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Invalid access token');
    }

    const data = (await response.json()) as SessionResponse;
    return {
      id: data.userId,
      role: data.data.role as string,
    };
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

export const verifyRefreshToken = async (token: string): Promise<RefreshTokenPayload> => {
  try {
    const response = await fetch(`${process.env.APP_URL}/auth/session/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Invalid refresh token');
    }

    const data = (await response.json()) as SessionResponse;
    return {
      id: data.userId,
    };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Token pair management
export const generateTokenPair = async (payload: AccessTokenPayload) => {
  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken({ id: payload.id });
  return { accessToken, refreshToken };
};

export const refreshTokenPair = async (refreshToken: string) => {
  try {
    const response = await verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: response.id },
      select: { rolesSlugs: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return generateTokenPair({
      id: response.id,
      role: user.rolesSlugs[0] || 'user', // Using the first role or defaulting to 'user'
    });
  } catch (error) {
    throw new Error('Failed to refresh tokens');
  }
};

// Token utilities
export const isTokenExpired = async (token: string): Promise<boolean> => {
  try {
    await verifyAccessToken(token);
    return false;
  } catch {
    return true;
  }
};

export const decodeToken = async (token: string) => {
  try {
    const response = await fetch(`${process.env.APP_URL}/auth/session/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Failed to decode token');
    }

    return response.json() as Promise<SessionResponse>;
  } catch (error) {
    throw new Error('Failed to decode token');
  }
};

// Token blacklist (using Better Auth's built-in session management)
export const blacklistToken = async (token: string) => {
  try {
    const response = await fetch(`${process.env.APP_URL}/auth/session/invalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Failed to blacklist token');
    }
  } catch (error) {
    throw new Error('Failed to blacklist token');
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    await verifyAccessToken(token);
    return false;
  } catch {
    return true;
  }
};

// Customer JWT functions
export const generateCustomerTokenPair = (payload: { id: string; role: string }) => {
  try {
    const accessToken = sign(
      {
        id: payload.id,
        role: payload.role,
        type: 'access',
      },
      JWT_SECRET,
      {
        expiresIn: '15m', // 15 minutes
        issuer: 'customer-auth',
        audience: 'customer',
      },
    );

    const refreshToken = sign(
      {
        id: payload.id,
        type: 'refresh',
      },
      JWT_REFRESH_SECRET,
      {
        expiresIn: '7d', // 7 days
        issuer: 'customer-auth',
        audience: 'customer',
      },
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Customer token generation error:', error);
    throw new Error('Failed to generate customer token pair');
  }
};

export const verifyCustomerAccessToken = (token: string): { id: string; role: string } => {
  try {
    const decoded = verify(token, JWT_SECRET, {
      issuer: 'customer-auth',
      audience: 'customer',
    }) as any;

    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return {
      id: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    throw new Error('Invalid customer access token');
  }
};

export const verifyCustomerRefreshToken = (token: string): { id: string } => {
  try {
    const decoded = verify(token, JWT_REFRESH_SECRET, {
      issuer: 'customer-auth',
      audience: 'customer',
    }) as any;

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return {
      id: decoded.id,
    };
  } catch (error) {
    throw new Error('Invalid customer refresh token');
  }
};

export const refreshCustomerTokenPair = async (refreshToken: string) => {
  try {
    // Verify refresh token first
    const verifyData = verifyCustomerRefreshToken(refreshToken);

    // Find customer to verify refresh token matches
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(verifyData.id) },
    });

    if (!customer || customer.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Generate new token pair
    const newTokens = generateCustomerTokenPair({
      id: customer.id.toString(),
      role: 'customer',
    });

    // Update refresh token in database
    await prisma.customer.update({
      where: { id: customer.id },
      data: { refreshToken: newTokens.refreshToken },
    });

    return newTokens;
  } catch (error) {
    console.error('Customer token refresh error:', error);
    throw new Error('Failed to refresh customer tokens');
  }
};

export const invalidateCustomerSession = async (accessToken: string) => {
  try {
    // Verify access token to get customer ID
    const verifyData = verifyCustomerAccessToken(accessToken);
    const customerId = parseInt(verifyData.id);

    // Clear refresh token from database
    await prisma.customer.update({
      where: { id: customerId },
      data: { refreshToken: null },
    });

    return {
      message: 'Customer session invalidated successfully',
      success: true,
    };
  } catch (error) {
    console.error('Customer session invalidation error:', error);
    throw new Error('Failed to invalidate customer session');
  }
};
