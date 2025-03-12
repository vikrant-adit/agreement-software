import {Component, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
export interface columns {
  id:string;
  name: string;
  selected: boolean;
}
@Component({
  selector: 'app-select-column-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    DragDropModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule
  ],
  templateUrl: './select-column-dialog.component.html',
  styleUrl: './select-column-dialog.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectColumnDialogComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<SelectColumnDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  columns:any[]=[];
  ngOnInit(): void {
    console.log(this.data)  
    this.columns=this.data 
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  // drop(event: CdkDragDrop<{selected: any; name: string}[]>) {
  //   //  moveItemInArray( this.columns ,event.previousIndex, event.currentIndex);
  //    this.columns.forEach((column:any)=>{
  //      if(column.sequence==event.previousIndex){
  //         column.sequence=event.currentIndex
  //         debugger
  //      }
  //    })
  //   console.log(this.columns)
  // }

  update(selected: boolean, id?: string) {
    this.columns.forEach((columns:any) => {
      if (id === columns.id) {
        columns.selected = selected;
        console.log({...columns})
      }
      return {...columns};
    });
  }

}
