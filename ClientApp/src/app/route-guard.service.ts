import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(
    private oAuthService: OAuthService,
    public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.oAuthService.hasValidAccessToken()) {
      console.log("Access token valid", route.toString());
      return true;
    } else {
      console.log("Route Guard: Access Token is not valid / not found");
      console.log(route.root);
      this.oAuthService.silentRefresh()
        .then(info => {
          console.log("Silent refresh:", info)
          location.reload(true);
        })
        .catch(error => {
          console.error("Silent Refresh Error:", error);
          sessionStorage.removeItem('userID');
          this.oAuthService.logOut();
         })
      return false;
    }
  }
}
