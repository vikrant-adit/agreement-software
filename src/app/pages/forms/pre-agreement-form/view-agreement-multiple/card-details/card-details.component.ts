import { Component, inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { OnlineFormAgreementService } from '../../../../../../services/online form/online-form-agreement.service';
import {  MAT_DIALOG_DATA,  MatDialogModule,  MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatInputModule,CommonModule],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss'
})
export class CardDetailsComponent implements OnInit{
  paymentForm!: FormGroup;
  readonly data = inject(MAT_DIALOG_DATA);
  agreementService = inject(OnlineFormAgreementService);
  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      country: ['United States', Validators.required]
    });
  }
ngOnInit(): void {
  console.log(this.data);
}
  onSubmit() {
    if (this.paymentForm.valid) {
      console.log(this.paymentForm.value);
      this.agreementService.addBillingData(this.paymentForm.value, this.data).subscribe((response) => {
        console.log('Payment details added successfully.');
      })
    } else {
      console.log('Form is invalid');
    }
  }
}
