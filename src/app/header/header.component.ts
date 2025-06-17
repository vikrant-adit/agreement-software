import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentRoute: string = '';
  isAgreementRoute: boolean = false;
  private authService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('Header component initialized');
    
    // Check the initial route immediately
    this.checkAgreementRoute(this.router.url);
    
    // Then subscribe to future route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkAgreementRoute(event.url);
    });
  }
  
  /**
   * Check if the current route is an agreement route
   */
  private checkAgreementRoute(url: string) {
    this.currentRoute = url;
    
    // List all agreement-related route patterns
    const agreementPatterns = [
      '/agreement/',     // Standard agreement route
    ];
    
    // Check if any pattern matches the current URL
    this.isAgreementRoute = agreementPatterns.some(pattern => 
      this.currentRoute.startsWith(pattern)
    );
    
    console.log('Current route:', this.currentRoute);
    console.log('Is agreement route:', this.isAgreementRoute);
  }

  routeTo(path: string) {
    this.router.navigate([`/${path}`]);
    if (path == 'login') {
      this.authService.logout();
    }
  }
}
