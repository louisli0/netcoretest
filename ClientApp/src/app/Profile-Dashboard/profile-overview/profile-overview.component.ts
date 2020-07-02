import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent implements OnInit {
  name;
  email;

  constructor(private accountService: AccountService) {
    this.name = this.accountService.getFullName();
    this.email = this.accountService.getEmail();
   }

  ngOnInit(): void {
  }
  
}
