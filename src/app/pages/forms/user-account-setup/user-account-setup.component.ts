import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environment';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-user-account-setup',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './user-account-setup.component.html',
  styleUrl: './user-account-setup.component.scss'
})
export class UserAccountSetupComponent implements OnInit {
  userForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true; 
  loading = false;
  serverErrors: { [key: string]: string } = {};

  organizationId: string = '';
  agreementId: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient,private route: ActivatedRoute) {
    this.userForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(16),
          Validators.pattern(/^[a-zA-Z\s]+$/)
        ]
      ],
      lastName: [
        '',
        [this.optionalNameValidator()]
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(40),
          Validators.pattern(/^[a-z0-9.,@+\-_]+$/)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordStrengthValidator()
        ]
      ],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator() });
  }
  ngOnInit(): void {
    this.agreementId = this.route.snapshot.paramMap.get('agreementId') || '';
  }
  // Custom validator for optional last name
  optionalNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      if (value.length < 2) return { minlength: true };
      if (value.length > 16) return { maxlength: true };
      if (!/^[a-zA-Z\s]+$/.test(value)) return { pattern: true };
      return null;
    };
  }

  // Passwords match validator
  passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  // Password strength validator
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const hasLowerCase = /[a-z]/.test(value);
      const hasUpperCase = /[A-Z]/.test(value);
      const hasDigit = /\d/.test(value);
      const hasSpecialChar = /[^a-zA-Z0-9]/.test(value);
      const isLengthValid = value.length >= 8;
      const isValid = hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar && isLengthValid;
      return isValid ? null : { passwordStrength: true };
    };
  }

  onSubmit() {
    this.userForm.markAllAsTouched();
    this.serverErrors = {};

    // XSS check (no "script" in any field)
    const fieldsToCheck = [
      this.f['firstName'].value,
      this.f['lastName'].value,
      this.f['username'].value,
      this.f['email'].value,
      this.f['password'].value
    ];
    if (fieldsToCheck.some(val => val && val.toLowerCase().includes('script'))) {
      alert('Invalid input detected.');
      return;
    }

    // if (this.userForm.invalid) {
    //   return;
    // }

    this.loading = true;

    const datafottfrm = {
      organization_id: '4432a2e8-2a51-4136-96c7-e4ada3299cb6',
      agreement_id: this.agreementId,
      register_first_name: this.f['firstName'].value,
      register_last_name: this.f['lastName'].value,
      register_username: this.f['username'].value,
      register_email: this.f['email'].value,
      register_password: this.f['password'].value,
      register_confirm_password: this.f['confirmPassword'].value,
    };

    this.http.post<any>(`${environment.baseUrl}/users/register-user`, datafottfrm).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && typeof response === 'string' && response.includes('||*||')) {
          const arr = response.split('||*||');
          if (arr[1] === 'fail') {
            if (arr[2] === 'Username already exists!') {
              this.serverErrors['username'] = arr[2];
            } else {
              this.serverErrors['confirmPassword'] = arr[2];
            }
            return;
          } else {
            window.location.href = arr[2];
            return;
          }
        } else if (response && response.error) {
          Object.values(response.error).forEach((field: any) => {
            this.serverErrors[field] = 'Required';
          });
        }
      },
      error: () => {
        this.loading = false;
        alert('An error occurred. Please try again.');
      }
    });
  }

  get f() {
    return this.userForm.controls;
  }
}
