import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';


@Injectable({
  providedIn: 'root'
})

export class TokenIntercept implements HttpInterceptor {
  token: HttpHeaders;

  constructor(
    private oAuthService: OAuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Token-Intercept:", req.url);
    if(req.url.includes("api")) {
      console.log("Api Path - Add auth");
      if (this.oAuthService.hasValidAccessToken()) {
        console.log("Valid Token");
        req = req.clone({
          headers: req.headers.set('Authorization', "Bearer " + this.oAuthService.getAccessToken())
        })  
      } else {
        this.oAuthService.silentRefresh()
        .then(data => {
          console.log("Token Silent Refresh", data);
        })
        .catch(error => {
          console.log('silent refresh eror', error);
          this.oAuthService.logOut();
        })

      }
    }
    return next.handle(req).pipe(catchError(err => {
      if(err.status === 401) {
        this.oAuthService.logOut();
        location.reload(true);
      }
      return throwError(err);
    }));
  }
}
