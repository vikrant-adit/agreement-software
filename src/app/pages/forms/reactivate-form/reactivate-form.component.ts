import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HeaderComponent } from '../../../header/header.component';
@Component({
  selector: 'app-reactivate-form',
  standalone: true,
  imports: [ HeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule],
  templateUrl: './reactivate-form.component.html',
  styleUrl: './reactivate-form.component.scss'
})
export class ReactivateFormComponent {
  reactivateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reactivateForm = this.fb.group({
      accountId: [''],
      currency: [''],
      phones: [false],
      analytics: [false],
      verifications: [false],
    });
  }

  generatePresentation() {
    console.log(this.reactivateForm.value);
    // Add logic to generate presentation here
  }
}
