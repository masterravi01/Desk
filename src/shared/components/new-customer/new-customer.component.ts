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
  selector: 'app-new-customer',
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
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css',
})
export class NewCustomerComponent {
  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewCustomerComponent>
  ) {
    this.customerForm = this.fb.group({
      name: [''],
      otherPhone: [''],
      phone: [''],
      url: [''],
      email: [''],
      fax: [''],
      contact: [''],
      remark: [''],
      designation: [''],
      customerAddress: [''],
      customerCity: [''],
      customerZip: [''],
      customerState: [''],
      customerCountry: [''],
      buyerAddress: [''],
      buyerCity: [''],
      buyerZip: [''],
      buyerState: [''],
      buyerCountry: [''],
      bankName: [''],
      bankBranch: [''],
      bankAddress: [''],
      bankCity: [''],
      bankZip: [''],
      bankState: [''],
      bankCountry: [''],
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
