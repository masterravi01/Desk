import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NewCustomerComponent } from '../new-customer/new-customer.component';
import { ModalService } from '../../../core/services/modal.service';
import { NewCurrencyModalComponent } from '../new-currency-modal/new-currency-modal.component';
import { MasterService } from '../../../core/services/master.service';

@UntilDestroy()
@Component({
  selector: 'app-system-parameter-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
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
export class SystemParameterModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SystemParameterModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  displayedColumns: string[] = ['name', 'email', 'phone'];
  companyForm!: FormGroup;
  currency: any[] = [];

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCompanyData();
    this.loadCurrencies();
  }
  private initForm() {
    this.companyForm = this.fb.group({
      id: [1],
      companyCode: [''],
      companyName: [''],
      entryDate: [''],
      currencyCode: [''],
      createdBy: [''],
      remarks: [''],
      isCurrentCompany: [0],
      companyAddressLine1: [''],
      companyAddressLine2: [''],
      companyCity: [''],
      companyPostalCode: [''],
      companyCountry: [''],
      companyState: [''],
      bankName: [''],
      bankAddressLine1: [''],
      bankAddressLine2: [''],
      bankCity: [''],
      bankPostalCode: [''],
      bankCountry: [''],
      bankState: [''],
      swiftCode: [''],
      accountNumber: [''],
      additionalNumber: [''],
      importExportCode: [''],
      taxIdentificationNumber: [''],
    });
  }
  private loadCompanyData() {
    this.masterService
      .invoke('getCompany', 1)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.companyForm.patchValue(data);
          this.companyForm.disable();
        }
      });
  }

  private loadCurrencies() {
    this.masterService
      .invoke('getAllCurrencies')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.currency = data;
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
  enableEdit() {
    this.companyForm.enable();
  }
  openCustomerModal() {
    this.modalService.openModal(NewCustomerComponent, {
      width: '80%',
      height: '90%',
    });
  }

  openCurrencyModal(data?: any) {
    this.modalService
      .openModal(NewCurrencyModalComponent, {
        width: '50%',
        minHeight: '300px',
        position: { top: '40px' },
        data,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadCurrencies();
      });
  }

  onSave() {
    if (this.companyForm.disabled) {
      this.companyForm.enable();
    }
    const callUrl = this.companyForm.get('id')?.value
      ? 'updateCompany'
      : 'addCompany';
    this.masterService
      .invoke(callUrl, this.companyForm.value)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        console.log(data);
        this.initForm();
        this.loadCompanyData();
      });
  }
}
