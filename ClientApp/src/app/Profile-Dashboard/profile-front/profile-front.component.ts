import { Component, OnInit } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { Title } from '@angular/platform-browser';
import { AccountService } from 'src/app/account.service';
import { User } from 'src/app/Models/User';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-front',
  templateUrl: './profile-front.component.html',
  styleUrls: ['./profile-front.component.scss']
})
export class ProfileFrontComponent implements OnInit {
  verification: boolean;
  user: Observable<User>;
  
  constructor(
    private title: Title,
    private accountService: AccountService,
    private oAuthStorage: OAuthStorage) {
      this.title.setTitle('Overview');
      this.verification = JSON.parse(this.oAuthStorage.getItem("id_token_claims_obj")).email_verified;
    }

    ngOnInit() : void {
      this.user = this.accountService.getUserData();
    }
}
