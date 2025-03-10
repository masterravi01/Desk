import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-single-paramenter',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './single-paramenter.component.html',
  styleUrl: './single-paramenter.component.css',
})
export class SingleParamenterComponent {

  singleForm!: FormGroup;
  title = '';
  parameter = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SingleParamenterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data?.title || this.title;
    this.parameter = data?.parameter || this.parameter;
    let info = data?.info;
    this.singleForm = this.fb.group({
      id: [info?.id ? info?.id : ''],
      value: [info?.value ? info?.value : ''],
    });
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  onSave() {
    this.dialogRef.close(this.singleForm.value);
  }

  onDelete() {
    this.dialogRef.close({ ...this.singleForm.value, delete: true });
  }
}
