import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-choose-packages',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './choose-packages.component.html',
  styleUrl: './choose-packages.component.scss'
})
export class ChoosePackagesComponent {
  isAnnually: boolean = true;
  toggleView(view: 'annually' | 'monthly') {
    this.isAnnually = view === 'annually';
  }

}
