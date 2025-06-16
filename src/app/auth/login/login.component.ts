import {ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule,FormGroup, FormControl,FormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/users/user.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
private toaster = inject(ToastrService);
loginForm!:FormGroup
private userService=inject(UserService)
constructor(private route:Router){
  this.loginForm= new FormGroup({
    email:new FormControl('',Validators.required),
    password:new FormControl('',Validators.required)
  })
}
loading=false
login() {
  if (this.loginForm.valid) {
   
    const { email, password } = this.loginForm.value;

    this.userService.login(email, password).subscribe({
      next: (response) => {
     
         // Hide loader

        if (response.firstLogin) {
          this.openSnackBar('First-time login. Check your email for OTP.');
          this.route.navigate(['/verify-otp']);
          return;
        }

        // ✅ Store JWT tokens & user details
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('role', response.role);
        localStorage.setItem('permissions', JSON.stringify(response.permissions));
        this.openSnackBar(response.message);
        this.route.navigate(['/dashboard']);
     
      },
      error: (error) => {
      
        console.error('Login failed', error);

        let errorMessage = 'Login failed. Please try again.';
        if (error.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.openSnackBar(errorMessage);
      },
      complete: () => {
        this.loading = false; // Ensure loader is hidden
      }
    });
  }
}

openSnackBar(msg:string) {
  this.toaster.success(msg, 'Success');
}

hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}
