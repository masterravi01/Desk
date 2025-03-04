import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { NewCustomerComponent } from '../new-customer/new-customer.component';
import { ModalService } from '../../../core/services/modal.service';
import { ContainerModalComponent } from '../container-modal/container-modal.component';
import { NewCurrencyModalComponent } from '../new-currency-modal/new-currency-modal.component';
import { SingleParamenterComponent } from '../single-paramenter/single-paramenter.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-system-parameter-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './system-parameter-modal.component.html',
  styleUrl: './system-parameter-modal.component.css',
})
export class SystemParameterModalComponent {
  readonly dialogRef = inject(MatDialogRef<SystemParameterModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  displayedColumns: string[] = ['name', 'email', 'phone'];
  companyForm!: FormGroup;
  currency = [
    {
      id: '4',
      name: 'US Dollar',
      char: '$',
      country: 'USA',
    },
    {
      id: '4',
      name: 'US Dollar',
      char: '$',
      country: 'USA',
    },
    {
      id: '4',
      name: 'US Dollar',
      char: '$',
      country: 'USA',
    },
    {
      id: '4',
      name: 'US Dollar',
      char: '$',
      country: 'USA',
    },
  ];

  constructor(private modalService: ModalService, private fb: FormBuilder) {
    this.companyForm = this.fb.group({
      name: [''],
      shortName: [''],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      zip: [''],
      currency: [''],
      remark: [''],

      bankDetails: this.fb.group({
        bankName: [''],
        bankBranch: [''],
        bankAddress: [''],
        bankCity: [''],
        bankZip: [''],
        bankState: [''],
        bankCountry: [''],
        bankAccountNo: [''],
        bankSwiftCode: [''],
        bankIecCode: [''],
        bankAdCode: [''],
        bankPanNo: [''],
      }),
    });
  }
  onCancel(): void {
    this.dialogRef.close(false); // Return false on cancel
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Return true on confirm
  }
  openCustomerModal() {
    this.modalService.openModal(NewCustomerComponent, {
      width: '80%',
      height: '90%',
    });
  }

  openCurrencyModal() {
    this.modalService.openModal(NewCurrencyModalComponent, {
      width: '50%',
      height: '90%',
      position: {
        top: '40px',
      },
    });
  }
  onSave() {
    console.log(this.companyForm.value);
    this.dialogRef.close(this.companyForm.value);
  }
}
