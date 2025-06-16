import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
@Component({
  selector: 'app-pre-agreement-welcome',
  standalone: true,
  imports: [MatButtonModule, MatIconModule,HeaderComponent, MatGridListModule],
  templateUrl: './pre-agreement-welcome.component.html',
  styleUrl: './pre-agreement-welcome.component.scss'
})
export class PreAgreementWelcomeComponent {
  actions = [
    { label: 'Online Demo', icon: 'computer',route:'pre-agreement-form' },
    { label: 'In-Person Demo', icon: 'person_pin',route:'in-person-lead-form' },
    { label: 'Subscription Change', icon: 'subscriptions',route:'pre-agreement-form-verification' },
    { label: 'Re-Activate', icon: 'autorenew',route:'reactivate-form' },
    { label: 'Upgrade Demo', icon: 'settings',route:'upgrade-demo' }
  ];
  
  constructor(private route:Router){

  }
  routeToForms(path:string){
    this.route.navigate(['/',path])
  }
}
