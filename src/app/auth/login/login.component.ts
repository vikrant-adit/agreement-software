import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule,FormGroup, FormControl,FormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/users/user.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
private _snackBar = inject(MatSnackBar);
loginForm!:FormGroup
private userService=inject(UserService)
constructor(private route:Router){
  this.loginForm= new FormGroup({
    username:new FormControl('',Validators.required),
    password:new FormControl('',Validators.required)
  })
}
loading=false
login() {
  if (this.loginForm.valid) {
    this.loading = true; // Show loader
    const { username, password } = this.loginForm.value;

    this.userService.login(username, password).subscribe({
      next: (response) => {
        this.loading = false; // Hide loader
        if (response.firstLogin) {
          this.openSnackBar('First-time login. Check your email for OTP.');
          this.route.navigate(['/verify-otp']);
        } else {
          this.route.navigate(['/dashboard']);
          this.openSnackBar(response.message)
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId',response.userId)
        }
      },
      error: (error) => {
        this.loading = false; // Hide loader on error
        console.error('Login failed', error);
      }
    });
  }
}
openSnackBar(msg:string) {
  this._snackBar.open(msg, 'OK', {
    horizontalPosition: 'center',
    verticalPosition: 'top',
  });
}

}
