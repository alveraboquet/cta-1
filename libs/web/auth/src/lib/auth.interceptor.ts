import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, switchMap, take } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token = null as string | null;

  constructor(private readonly auth: AngularFireAuth) {
    this.auth.idToken.subscribe(token => this.token = token);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let result;

    if (this.token) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.token}`)
      });
      result = next.handle(req);
    } else {
      result = this.auth.idToken.pipe(
        take(1),
        switchMap(token => {
          if (token) {
            req = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
          }
          return next.handle(req);
        })
      );
    }

    return result;
  }
}
