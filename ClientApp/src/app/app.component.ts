import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { AccountService } from './account.service';
import { authConfig } from './auth.config';
import { SnackbarService } from './snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'app';

  constructor(
    private oAuthService: OAuthService,
    private accountService: AccountService,
    private snackBar: SnackbarService,
    private matSnackBar: MatSnackBar,
  ) {
    
    this.snackBar.notification.subscribe(message => {
      this.matSnackBar.open(message, null, {
        duration: 3000,
      });
    })

    this.oAuthService.configure(authConfig);
    this.oAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin()
      .then(data => {
        console.log("Keycloak ", data);
        this.accountService.verifyUserDBEntry();
      })
      .catch(error => console.error("Keycloak error:", error));
  }
}
