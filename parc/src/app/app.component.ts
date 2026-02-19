import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './Service/auth.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'parc';
  currentLang: string = window.location.hostname === 'parcattraction-en' ? 'en' : 'fr';

  constructor(public authService: AuthService, public router: Router) {
    this.authService.setUser()
  }

  toggleLanguage() {
    const path = this.router.url;
    if (this.currentLang === 'fr') {
      window.location.href = 'https://parcattraction-en' + path;
    } else {
      window.location.href = 'https://parcattraction' + path;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

}
