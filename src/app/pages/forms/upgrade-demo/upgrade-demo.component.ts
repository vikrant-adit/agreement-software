import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from "../../../header/header.component";

@Component({
  selector: 'app-upgrade-demo',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    HeaderComponent
],
  templateUrl: './upgrade-demo.component.html',
  styleUrl: './upgrade-demo.component.scss'
})
export class UpgradeDemoComponent {
  upgradeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.upgradeForm = this.fb.group({
      interestedUpgrade: ['', Validators.required],
      bookedBy: ['', Validators.required],
      schedulingRemarks: [''],
    });
  }

  submitForm() {
    if (this.upgradeForm.valid) {
      console.log(this.upgradeForm.value);
      // Add your logic to handle form submission here
    } else {
      // Handle form validation errors
      console.log('Form is invalid');
    }
  }
}
