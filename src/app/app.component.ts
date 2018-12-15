import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { user } from 'src/models/user';
import { AuthService } from './core/auth.service';
import { LifxService } from './core/lifx.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  onMobile: boolean;
  developerMode: boolean = true;
  user: user;

  constructor(private lifx: LifxService, private auth: AuthService, private breakpointObserver: BreakpointObserver) {

    this.user = JSON.parse(localStorage.getItem('user'));
    this.fetchLoggedInUser();

    this.breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.onMobile = true
      } else {
        this.onMobile = false
      }
    });
  }

  logIn() {
    this.auth.googleLogin();
    this.fetchLoggedInUser();
  }

  private fetchLoggedInUser() {
    this.auth.user.subscribe(user => {
      if (user) { this.lifx.updateFirestore(user) };
      this.user = user;
    });
  }
}
