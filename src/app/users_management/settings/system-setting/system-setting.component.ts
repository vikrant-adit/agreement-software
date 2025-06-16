import { Component, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { UserService } from '../../../../services/users/user.service';
import { EventRepsService } from '../../../../services/system-setting/event-reps.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-system-setting',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,NgxMatSelectSearchModule,MatSelectModule, MatIconModule, MatTooltipModule],
  templateUrl: './system-setting.component.html',
  styleUrl: './system-setting.component.scss'
})
export class SystemSettingComponent {
  users: any[] = [];
  userSearched:any
  userList:any[]=[]
  constructor() {}
  private searchTerms = new Subject<string>();
  private userService=inject(UserService)
  private eventService=inject(EventRepsService)
  ngOnInit(): void {
    this.loadUsers()

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.userService.getUsers(1,10,term))
    ).subscribe(users =>{
      this.users=users.data 
      // console.log(users)
    } );
  }

  search(event: Event): void {
    let searchTerm= (event.target as HTMLInputElement).value
    console.log(searchTerm)
    this.searchTerms.next(searchTerm);
  }

  loadUsers(): void {
  this.eventService.getUsers().subscribe(res=>{
    this.userList=res.data
  })
  }

  addUser(event:any): void {
   console.log( event.value.id)
    // let searchTerm= (select.target as HTMLInputElement)
    // console.log(searchTerm)
    this.eventService.addEventRep(event.value.id).subscribe(res=>{
      console.log(res)
    })
    this.loadUsers()
  }

  deleteUser(id: number): void {
   this.eventService.deleteEventRep(id)
  }

}
