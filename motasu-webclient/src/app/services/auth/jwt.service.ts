import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  /**
   * Decode a JWT token and return the payload
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if a token is expired
   * @param token JWT token string
   * @returns true if token is expired, false otherwise
   */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    
    // Add 1 minute buffer for clock skew
    return currentTime > expiryTime - 60000;
  }

  /**
   * Get the expiry time of a token
   * @param token JWT token string
   * @returns Expiry timestamp in milliseconds, or null if invalid
   */
  getTokenExpiry(token: string): number | null {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return null;
    }
    return payload.exp * 1000;
  }

  /**
   * Get time until token expires in seconds
   * @param token JWT token string
   * @returns Seconds until expiry, or null if invalid
   */
  getTimeUntilExpiry(token: string): number | null {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) {
      return null;
    }
    return Math.floor((expiry - Date.now()) / 1000);
  }

  /**
   * Validate that a token exists and is not expired
   * @param token JWT token string
   * @returns true if token is valid, false otherwise
   */
  isTokenValid(token: string): boolean {
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }
}
