import { Component } from '@angular/core';
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
  selector: 'app-container-modal',
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
  templateUrl: './container-modal.component.html',
  styleUrl: './container-modal.component.css',
})
export class ContainerModalComponent {
  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ContainerModalComponent>
  ) {
    this.customerForm = this.fb.group({
      name: [''],
      type: [''],
      width: [''],
      height: [''],
      length: [''],
      weight: [''],
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    console.log(this.customerForm.value);
    this.dialogRef.close(this.customerForm.value);
  }
}
