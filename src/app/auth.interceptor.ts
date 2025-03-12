import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');

    let modifiedReq = req;
    if (token) {
      modifiedReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          return this.handle401Error(modifiedReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshAccessToken().pipe(
        switchMap((response) => {
          const newToken = response.accessToken;
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newToken);
          localStorage.setItem('accessToken', newToken);

          return next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout(); // Clear tokens and redirect to login
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((newToken) => {
          return next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
        })
      );
    }
  }
}
