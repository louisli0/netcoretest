import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { SnackbarService } from './snackbar.service';
import { User } from './Models/User';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  claimsObject: any;
  localUserID: number;
  localUserEntry: User;

  constructor(
    private snackBar: SnackbarService,
    private oAuthService: OAuthService,
    private oAuthStorage: OAuthStorage,
    private http: HttpClient,
  ) { }

  checkLoginState(): boolean {
    return this.oAuthService.hasValidAccessToken()
  }

  getUserData() : Observable<User> {
    console.log(this.localUserEntry);
    if(this.localUserEntry != undefined) {
      return of(this.localUserEntry);
    }
  }

  getEmail(): string {
    if (this.localUserEntry) {
      return this.localUserEntry.email;
    } else if (this.claimsObject) {
      this.claimsObject = JSON.parse(sessionStorage.getItem('id_token_claims_obj'));
      return this.claimsObject.email;
    } else {
      return 'Unknown Error';
    }
  }

  getFullName(): string {
    if (this.localUserEntry) {
      return this.localUserEntry.name;
    } else if (this.claimsObject) {
      this.claimsObject = JSON.parse(sessionStorage.getItem('id_token_claims_obj'));
      return this.claimsObject.name;
    }
  }

  getAccessToken(): string {
    this.claimsObject = JSON.parse(sessionStorage.getItem('id_token_claims_obj'));
    return this.claimsObject.access_token;
  }

  getUserID(): string {
    if (this.checkLoginState()) {
      this.claimsObject = JSON.parse(sessionStorage.getItem('id_token_claims_obj'));
      return this.claimsObject.sub;
    }
    return null;
  }

  updateEmail(data: any): void {
    console.log("Email Update", data);
    this.http.put('api/admin/updateEmail', data).subscribe(data => {
      this.snackBar.notification.next("Updated email!");
      this.verifyUserDBEntry();
    }, error => {
      this.snackBar.notification.next("Unable to update email");
    });
  }

  updateName(data) {
    console.log("Account Service: Update name", data);
    return this.http.put('api/admin/updateName', data).subscribe(data => {
      this.snackBar.notification.next("Updated name!");
      this.verifyUserDBEntry();
    }, error => {
      this.snackBar.notification.next("Unable to update name");
    });
  }

  updatePassword(data: any) {
    console.log("Account service: Update password", data);
    return this.http.put('api/admin/updatePassword', data).subscribe(data => {
      this.snackBar.notification.next("Updated password!");
    }, error => {
      this.snackBar.notification.next("Unable to update password");
    });
  }

  getLocalUserID() {
    if (sessionStorage.getItem('userID') != null) {
      return this.localUserID || sessionStorage.getItem('userID')
    } else {
      this.verifyUserDBEntry();
    }
  }

  verifyUserDBEntry() : void {
    if (this.oAuthService.hasValidAccessToken()) {
      const uID = JSON.parse(this.oAuthStorage.getItem("id_token_claims_obj")).sub;
      this.http.get('api/admin/getLocalUserEntry/' + uID).subscribe( (data : User) => {
        console.log("Got:", data);
        if (data != null) {
          this.localUserEntry = data;
          this.localUserID = this.localUserEntry.id;
          console.log(JSON.stringify(data));
          sessionStorage.setItem('localData', JSON.stringify(data));
          sessionStorage.setItem('userID', this.localUserEntry.id.toString());
        } else {
          console.log("Create new local user entry");
          let userObj = {
            userUUID: uID,
            name: JSON.parse(this.oAuthStorage.getItem("id_token_claims_obj")).name,
            email: JSON.parse(this.oAuthStorage.getItem("id_token_claims_obj")).email
          }
          this.addLocalDBEntry(userObj);
        }
      });
    } else {
      console.error("Not Logged in");
    }
  }

  async addLocalDBEntry(data) {
    let send = {
      id: data.userUUID,
      name: data.name
    };
    this.http.put('api/admin/addUserEntry/', send).subscribe((data: number) => {
      this.localUserID = data;
    });

  }

  addLocationID(data: any) {
    let a = {
      id: this.getUserID(),
      locationID: data.locationId
    };
    this.http.put('api/admin/updateUserLoc/', a).subscribe( () => {
      this.snackBar.notification.next("Added");
    }, () => {
      this.snackBar.notification.next("Failed to add location to user");
    });
  }

  returnPhone(): number {
    if (this.localUserEntry) {
      return this.localUserEntry.phone;
    }
  }

  updatePhone(data: any): void {
    let send = {
      id: this.getUserID(),
      phone: data.value
    };
    this.http.put('api/admin/updatePhone/', send).subscribe(() => {
      this.snackBar.notification.next("Updated Phone");
    }, () => {
      this.snackBar.notification.next("Error Updating Phone")
    });
  }
}
