import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatMenuModule,MatIconModule,MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService=inject(AuthService)
constructor(private route:Router){}
  routeTo(path:string){
    this.route.navigate([`/${path}`])
    if(path=='login'){
      this.authService.logout()
    }
  }
}
