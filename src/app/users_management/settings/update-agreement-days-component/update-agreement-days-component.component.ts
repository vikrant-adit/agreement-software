import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OnlineFormAgreementService } from '../../../../services/online form/online-form-agreement.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-agreement-days-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-agreement-days-component.component.html',
  styleUrl: './update-agreement-days-component.component.scss'
})
export class UpdateAgreementDaysComponent implements OnInit {
  agreementForm!: FormGroup;
  private onlineFormAgreementService = inject(OnlineFormAgreementService);
  private toastr = inject(ToastrService);
  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.agreementForm = this.fb.group({
      agreementId: ['', Validators.required],
      numberOfDays: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.agreementForm.valid) {
      this.isLoading = true;
      this.onlineFormAgreementService.updateDays(
        { no_of_days: this.agreementForm.value.numberOfDays },
        this.agreementForm.value.agreementId
      ).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success('Agreement days updated successfully!', 'Success');
          this.agreementForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(error.message || 'Failed to update agreement days', 'Error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      // Mark form controls as touched to display validation errors
      this.agreementForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields correctly', 'Warning');
    }
  }
}
