import { Component, inject } from '@angular/core';
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
import { MasterService } from '../../../core/services/master.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
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
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ContainerModalComponent>,
    private masterService: MasterService

  ) {
    this.customerForm = this.fb.group({
      ID: [''],
      CName: [''],
      Ctype: [''],
      Width: [''],
      Height: [''],
      Weight: [''],
      Length: [''],
    });
    if (this.data?.ID) {
      this.customerForm.patchValue(this.data);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    let action = this.customerForm.get('ID')?.value ? 'updateContainer' : 'addContainer';
    this.masterService
      .invoke(action, this.customerForm.value)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        console.log(data);
      });
    this.dialogRef.close(this.customerForm.value);
  }
  onDelete() {
    this.masterService
      .invoke('deleteContainer', this.customerForm.get('ID')?.value)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        console.log(data);
      });
    this.dialogRef.close({ ...this.customerForm.value, delete: true });
  }
}
