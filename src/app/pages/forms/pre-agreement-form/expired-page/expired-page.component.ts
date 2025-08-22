import { Component } from '@angular/core';

@Component({
  selector: 'app-expired-page',
  standalone: true,
  imports: [],
  templateUrl: './expired-page.component.html',
  styleUrl: './expired-page.component.scss'
})
export class ExpiredPageComponent {
goToWebsite(){
  window.open('https://adit.com/reviews');
}
}
