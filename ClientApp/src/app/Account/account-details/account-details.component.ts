import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { AccountService } from '../../account.service';
import { Title } from '@angular/platform-browser';
import { SnackbarService } from 'src/app/snackbar.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})

export class AccountDetailsComponent implements OnInit {
  userID: string;
  claimsObject: any;
  email: string;
  fullName: string;
  phone: number;

  constructor(
    private formBuilder: FormBuilder,
    private title: Title,
    private snackBar: SnackbarService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.title.setTitle('Account Settings');
    this.claimsObject = JSON.parse(sessionStorage.getItem('id_token_claims_obj'));
    this.userID = this.claimsObject.sub;
    this.email = this.accountService.getEmail();
    this.fullName = this.accountService.getFullName();
    this.phone = this.accountService.returnPhone();
  }
  
  emailForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.min(5), Validators.email]],
    emailConfirmation: ['', [Validators.email, Validators.required]]
  });

  nameForm = this.formBuilder.group({
    givenName: ['', [Validators.required, Validators.minLength(2)]],
    familyName: ['', [Validators.required, Validators.minLength(2)]]
  });

  passwordForm = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(4)]],
    passwordConfirmation: ['', [Validators.required, Validators.minLength(4)]]
  });

  phoneNumberForm = new FormControl('', Validators.required);

  validatePhone() : void {
    if (!this.phoneNumberForm.hasError) {
      this.snackBar.notification.next("Phone Number is required");
    } else {
      this.accountService.updatePhone(this.phoneNumberForm);
    }
  }
  validateEmail(): void {
    const newEmail = this.emailForm.get('email').value;
    const emailConfirmation = this.emailForm.get('emailConfirmation').value;
    if (newEmail === emailConfirmation) {
      console.log("Valid")
      let send = {
        id: this.userID,
        email: newEmail
      }
      this.accountService.updateEmail(send);
    } else {
      console.log("Not valid", newEmail, emailConfirmation, this.emailForm)
    }
  }

  validateName(): void {
    console.log(this.nameForm);
    let send = {
      id: this.userID,
      firstName: this.nameForm.value.givenName,
      lastName: this.nameForm.value.familyName,
    }
    this.accountService.updateName(send);
  }

  validatePassword(): void {
    let newPassword = this.passwordForm.value.password;
    let passwordConfirmation = this.passwordForm.value.passwordConfirmation;
    if (newPassword === passwordConfirmation) {
      let send = {
        id: this.userID,
        password: newPassword
      }
      this.accountService.updatePassword(send);
    } else {
      this.snackBar.notification.next("Passwords do not match");
    }
  }

  validatePasswordForm(): Boolean {
    let newPassword = this.passwordForm.value.password;
    let passwordConfirmation = this.passwordForm.value.passwordConfirmation;
    if (newPassword === passwordConfirmation && this.passwordForm.valid) {
      return false;
    }
    return true;
  }

  validateEmailForm(): Boolean {
    const newEmail = this.emailForm.get('email').value;
    const emailConfirmation = this.emailForm.get('emailConfirmation').value;
    if(newEmail === emailConfirmation) {
      return false;
    }
    return true;
  }

  handlePasswordFormErrors(): String {
    //Check Password
    if (this.passwordForm.controls['password'].hasError('required')) {
      return 'Required';
    }
    if (this.passwordForm.controls['password'].hasError('minlength')) {
      return 'Minimum length not met'
    }
    return '';
  }

  handleEmailFormErrors(): String {
    if(this.emailForm.controls['email'].hasError('email')) {
      return 'Not valid email';
    }
    if(this.emailForm.controls['email'].hasError('required')) {
      return 'Required';
    }
    return '';
  }
}