import { EMAIL_STORAGE_NAME } from 'src/app/config/my-app-config';

import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated = false;
  userFirstName: string;
  storage: Storage = sessionStorage;

  constructor(
    private oktaAuthService: OktaAuthService
  ) { }

  ngOnInit() {
    // subscribe to the authentication state ngOnChanges(changes: SimpleChanges): void {
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      // fetch the logged in user details
      this.oktaAuthService.getUser().then(
        (res) => {
          this.userFirstName = res.given_name;
          this.storage.setItem(EMAIL_STORAGE_NAME, JSON.stringify(res.email));
        }
      );
    }
  }

  logout() {
    this.oktaAuthService.signOut();
  }

}
