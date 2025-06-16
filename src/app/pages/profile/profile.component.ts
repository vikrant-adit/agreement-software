import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { UserService } from '../../../services/users/user.service';
import { mockData } from '../../../assets/mock-data/mock-data';

@Component({
  selector: 'app-profile',
  standalone: true,
   imports:[HeaderComponent,MatIconModule,MatCheckboxModule,MatExpansionModule,
      MatFormFieldModule,
      MatButtonModule,
      FormsModule,
      ReactiveFormsModule,
      MatInputModule,
      MatToolbarModule,
      MatSelectModule,
      MatDatepickerModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent  implements OnInit{
  userForm: FormGroup;
  private userService=inject(UserService)
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['',Validators.required,],
      // password: [''],
      role:['']
    });
  }

  ngOnInit(): void {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    

    // Find user in mock data
    const user = mockData.users.find(u => u.id.toString() === userId);
    
    if (user) {
      // Find role details
      const role = mockData.roles.find(r => r.name === user.role);
      
      // Create user data object with role information
    
      // Patch form with user data
      this.userForm.patchValue(user);
    }
  }

  // createUser() {
  //   console.log(this.userForm.value);
  // }

}
