import { Injectable } from '@angular/core';
import { CanActivate, Router,ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const requiredPermission = route.data['permission']; // 👈 Get permission from route
    const userPermissions = this.authService.getUserPermissions(); // 👈 Get stored permissions
    if (!accessToken) {
      return this.redirectToLogin();
    }
    if (!userPermissions.includes(requiredPermission)) {
      this.router.navigate(['/unauthorized']); // Redirect if no permission
      return false;
    }
  

    if (this.isTokenExpired(accessToken)) {
      if (refreshToken && !this.isTokenExpired(refreshToken)) {
        try {
          const newTokenData:any = await firstValueFrom(this.authService.refreshAccessToken());
          if (newTokenData?.accessToken) {
            localStorage.setItem('accessToken', newTokenData.accessToken);
            localStorage.setItem('role', newTokenData.role);
            localStorage.setItem('permissions', JSON.stringify(newTokenData.permissions));
            return true; // Token refreshed successfully, allow access
          }
        } catch (error) {
          return this.redirectToLogin();
        }
      } else {
        return this.redirectToLogin(); // Refresh token expired, force login
      }
    }

    return true; // Token is valid, allow access
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (e) {
      return true; // If decoding fails, assume expired
    }
  }

  private redirectToLogin(): boolean {
    this.router.navigate(['/login']);
    return false;
  }
}
