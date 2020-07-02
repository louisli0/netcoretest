import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  constructor(
    private oAuthService: OAuthService
  ) {}

  login() { this.oAuthService.initLoginFlow(); }
  logout() { sessionStorage.removeItem('userID'); this.oAuthService.logOut(); }

  get givenName() {
    let claims: any;
    claims = this.oAuthService.getIdentityClaims();
    if(!claims) return null;
    return claims.name;
  }
}
