import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from "../../../header/header.component";
@Component({
  selector: 'app-pre-agreement-form-verification',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './pre-agreement-form-verification.component.html',
  styleUrl: './pre-agreement-form-verification.component.scss'
})
export class PreAgreementFormVerificationComponent {
  packageForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.packageForm = this.fb.group({
      accountID:['']
    });
  }
  onSubmit() {
    if (this.packageForm.valid) {
      console.log(this.packageForm.value);
      // Here you can add logic to generate the presentation
    } else {
      console.log('Form is invalid');
    }
  }
}
