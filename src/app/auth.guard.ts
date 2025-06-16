import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    // If using mock data, skip all permission and token validation
    if (environment.useMockData) {
      // For mock data, we'll always allow access
      return true;
    }

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!accessToken) {
      return this.redirectToLogin();
    }
    
    // Check token expiration first
    if (this.isTokenExpired(accessToken)) {
      if (refreshToken && !this.isTokenExpired(refreshToken)) {
        try {
          const newTokenData: any = await firstValueFrom(this.authService.refreshAccessToken());
          if (newTokenData?.accessToken) {
            localStorage.setItem('accessToken', newTokenData.accessToken);
          } else {
            return this.redirectToLogin();
          }
        } catch (error) {
          return this.redirectToLogin();
        }
      } else {
        return this.redirectToLogin();
      }
    }
    
    // Then check permissions
    const requiredPermission = route.data['permission'];
    if (requiredPermission) {
      const userPermissions = this.authService.getUserPermissions();
      if (!userPermissions || !userPermissions.includes(requiredPermission)) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }

  private isTokenExpired(token: string): boolean {
    if (environment.useMockData) {
      // For mock data, we'll consider the token valid
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  }

  private redirectToLogin(): boolean {
    if (!environment.useMockData) {
      this.router.navigate(['/login']);
    }
    return false;
  }
}
