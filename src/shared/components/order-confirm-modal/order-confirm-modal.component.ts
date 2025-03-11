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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
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
    TitleCasePipe,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './order-confirm-modal.component.html',
  styleUrl: './order-confirm-modal.component.css',
})
export class OrderConfirmModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<OrderConfirmModalComponent>);
  invoiceForm!: FormGroup;
  invoiceDetailsForm!: FormGroup;
  currencies: any[] = [];
  instructions: any[] = [];
  containers: any[] = [];
  customers: any[] = [];
  displayedColumns: string[] = [
    'containerType',
    'containerTo',
    'containerFrom',
    'length',
    'width',
    'thickness',
    'squareMeter',
    'materialGrade',
    'brandName',
    'materialQuality',
    'finishType',
    'thicknessDetail',
    'quantity',
    'rate',
    'prefixCode',
  ];

  boxes: any[] = [
    {
      invoiceDetailId: 'INV001',
      invoiceId: '12345',
      containerType: 'Type A',
      containerTo: 'Mumbai',
      containerFrom: 'Delhi',
      length: '12m',
      width: '5m',
      thickness: '3cm',
      squareMeter: '60',
      materialGrade: 'Grade A',
      brandName: 'ABC Co.',
      materialQuality: 'High',
      finishType: 'Glossy',
      thicknessDetail: 'Detailed Info',
      quantity: '100',
      rate: '200',
      remarks: 'Urgent Delivery',
      designType: 'Custom',
      prefixCode: 'PRE-001',
      grossWeight: '500kg',
      netWeight: '450kg',
      boxType: 'Wooden',
      subWeight: '50kg',
    },
  ];
  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.invoiceForm.disable();

    this.loadData();
    this.masterService
      .invoke('getInvoice', 20)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        // this.invoiceForm.patchValue(data);
      });
  }
  initForm() {
    const today = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
    this.invoiceForm = this.fb.group({
      invId: [''],
      customerOrderNo: ['', Validators.required],
      invoiceDate: [today],
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
      currency: ['USD'],
      status: [''],
      discountType: [''],
      discountValue: [''],
      additionalChargeType: [''],
      additionalChargeValue: [''],
      reference: [''],
      totalQuantity: [0],
      totalAmount: [0],
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
      calculationType: ['Per Sq. Mt'],
      bankAddress: [''],
    });

    this.invoiceDetailsForm = this.fb.group({
      invoiceDetailId: [''],
      invoiceId: ['', Validators.required],
      containerType: ['', Validators.required],
      containerTo: [''],
      containerFrom: [''],
      length: [''],
      width: [''],
      thickness: [''],
      squareMeter: [''],
      materialGrade: [''],
      brandName: [''],
      materialQuality: [''],
      finishType: [''],
      thicknessDetail: [''],
      quantity: ['', Validators.required],
      rate: ['', Validators.required],
      remarks: [''],
      designType: [''],
      prefixCode: [''],
      grossWeight: [''],
      netWeight: [''],
      boxType: [''],
      subWeight: [''],
    });
  }

  private loadData() {
    this.masterService
      .invoke('getAllCurrencies')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.currencies = data;
      });
    this.masterService
      .invoke('getAllContainer')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.containers = data;
      });
    this.masterService
      .invoke('getAllCustomers')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.customers = data;
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
  openSelectModal(): void {
    this.dialogRef.close(true);
  }
  onDelete(): void {
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

  selectRow(row: any) {}
  onSave() {
    if (this.invoiceForm.disabled) {
      this.invoiceForm.enable();
    }
    console.log(this.invoiceForm.value);
    // const callUrl = this.invoiceForm.get('id')?.value
    //   ? 'updateCompany'
    //   : 'addCompany';
    // this.masterService
    //   .invoke(callUrl, this.invoiceForm.value)
    //   .pipe(untilDestroyed(this))
    //   .subscribe((data) => {
    //     console.log(data);
    //     this.initForm();
    //     this.loadCompanyData();
    //   });
  }
}
