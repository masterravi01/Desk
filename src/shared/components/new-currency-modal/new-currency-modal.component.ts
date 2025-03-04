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
import { MasterService } from '../../../core/services/master.service';

@Component({
  selector: 'app-new-currency-modal',
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
  templateUrl: './new-currency-modal.component.html',
  styleUrl: './new-currency-modal.component.css',
})
export class NewCurrencyModalComponent {
  currencyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewCurrencyModalComponent>,
    private masterService: MasterService
  ) {
    this.currencyForm = this.fb.group({
      currencyName: [''],
      currencyChar: [''],
      currencyCountry: [''],
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    console.log(this.currencyForm.value);
    const sub = this.masterService
      .invoke('addCurrency', this.currencyForm.value)
      .subscribe((data) => {
        console.log(data);
      });

    this.dialogRef.close(this.currencyForm.value);
  }
}
