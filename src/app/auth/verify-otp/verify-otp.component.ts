import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/users/user.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss'
})
export class VerifyOtpComponent {
  verifyOtpForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService, private router: Router) {
    this.verifyOtpForm = new FormGroup({
      email: new FormControl('', Validators.required), // This should be set dynamically
      otp: new FormControl('', [Validators.required, Validators.minLength(6)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  verifyOtp() {
    if (this.verifyOtpForm.valid) {
      const { email, otp, newPassword } = this.verifyOtpForm.value;

      this.userService.verifyOtp(email, otp, newPassword).subscribe({
        next: (response) => {
          this.successMessage = 'OTP verified successfully. You can now log in.';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Failed to verify OTP. Please try again.';
        }
      });
    }
  }
  isResendDisabled:boolean=false
  resendMessage=''
  resendOTP() {
    this.isResendDisabled = true;
    this.resendMessage = 'Sending new OTP...';
    const { email } = this.verifyOtpForm.value;
    this.userService.resendOTP(email).subscribe(
      (response: any) => {
        this.resendMessage = 'A new OTP has been sent to your email.';
        setTimeout(() => (this.isResendDisabled = false), 30000); // Disable button for 30 seconds
      },
      (error) => {
        this.resendMessage = 'Failed to send OTP. Please try again!';
        this.isResendDisabled = false;
      }
    );
  }
}
