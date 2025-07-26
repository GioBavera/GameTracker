import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { AuthService } from './services/auth';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})

export class App implements OnInit {
  protected title = 'Game Tracker';

  constructor( 
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const auth = this.authService.isAuthenticated();
      if (auth) {
        this.authService.autoRefreshToken();
      }
    }
  }

}
