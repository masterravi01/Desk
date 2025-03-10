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
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
@UntilDestroy()
@Component({
  selector: 'app-order-confirm-modal',
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
    MatCardModule,
    MatDatepickerModule,
    MatRadioModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './order-confirm-modal.component.html',
  styleUrl: './order-confirm-modal.component.css',
})
export class OrderConfirmModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<OrderConfirmModalComponent>);
  invoiceForm!: FormGroup;
  currency: any[] = [];
  parameters: any[] = [];
  foods = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCompanyData();
    this.loadCurrencies();
    this.masterService
      .invoke('getInvoice', 20)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        // this.invoiceForm.patchValue(data);
      });
  }
  private initForm() {
    this.invoiceForm = this.fb.group({
      invId: [null],
      customerOrderNo: [''],
      invoiceDate: [''],
      invoiceSerial: [''],
      invoicePiNo: [''],
      customerId: [null],
      customerName: [''],
      customerAddress: [''],
      customerCity: [''],
      customerZip: [''],
      customerState: [''],
      customerCountry: [''],
      billingAddress: [''],
      billingCity: [''],
      billingZip: [''],
      billingState: [''],
      billingCountry: [''],
      currency: [''],
      status: [''],
      discountType: [''],
      discountValue: [''],
      additionalChargeType: [''],
      additionalChargeValue: [''],
      reference: [''],
      totalQuantity: [''],
      totalAmount: [''],
      totalSquareMeters: [''],
      rounding: [''],
      netAmount: [''],
      deliveryTerms: [''],
      deliveryDetails: [''],
      shippingDetails: [''],
      paymentTerms: [''],
      portOfDischarge: [''],
      dispatchTerms: [''],
      bankName: [''],
      bankBranch: [''],
      bankCity: [''],
      swiftNumber: [''],
      comments: [''],
      calculationType: [null],
      bankAddress: [''],
    });
  }
  private loadCompanyData() {
    this.masterService
      .invoke('getCompany', 1)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.invoiceForm.patchValue(data);
          // this.invoiceForm.disable();
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
    this.invoiceForm.enable();
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
    if (this.invoiceForm.disabled) {
      this.invoiceForm.enable();
    }
    const callUrl = this.invoiceForm.get('id')?.value
      ? 'updateCompany'
      : 'addCompany';
    this.masterService
      .invoke(callUrl, this.invoiceForm.value)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        console.log(data);
        this.initForm();
        this.loadCompanyData();
      });
  }
}
