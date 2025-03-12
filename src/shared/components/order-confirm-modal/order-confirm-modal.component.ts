import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
import {
  CommonModule,
  DatePipe,
  SlicePipe,
  TitleCasePipe,
} from '@angular/common';
import { SelectCustomerComponent } from '../select-customer/select-customer.component';
import { SelectInstructionComponent } from '../select-instruction/select-instruction.component';
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
    SlicePipe,
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
    'containerFrom',
    'containerTo',
    'length',
    'width',
    'thickness',
    'squareMeter',
    'materialGrade',
    'brandName',
    'designType',
    'finishType',
    'thicknessDetail',
    'quantity',
    'rate',
    'prefixCode',
  ];
  columnHeaderMap: { [key: string]: string } = {
    containerType: 'Container Type',
    containerTo: 'To',
    containerFrom: 'From',
    length: 'Length',
    width: 'Width',
    thickness: 'Thickness',
    squareMeter: 'Area',
    materialGrade: 'Grade',
    brandName: 'Brand',
    finishType: 'Finish',
    thicknessDetail: 'Description',
    quantity: 'Quantity',
    rate: 'Rate',
    prefixCode: 'Prefix',
  };

  selectedIndex: number = 0;
  selectedIntructionIndex: number = 0;

  boxes = signal<any[]>([]); // Using signal for your `boxes` data

  // Remove form patching logic from computed signals
  totalQuantity = computed(() =>
    this.boxes().reduce((sum, box) => sum + Number(box.quantity || 0), 0)
  );

  totalAmount = computed(() => {
    const calculationType = this.invoiceForm.get('calculationType')?.value;

    return this.boxes().reduce((sum, box) => {
      const rate = Number(box.rate || 0);
      const quantity = Number(box.quantity || 0);
      const squareMeter = Number(box.squareMeter || 0);

      if (calculationType === 'Per Sq. Mt') {
        return sum + rate * squareMeter;
      } else if (calculationType === 'Per Sheet') {
        return sum + rate * quantity;
      }
      return sum;
    }, 0);
  });

  totalSquareMeters = computed(() =>
    Number(
      this.boxes()
        .reduce((sum, box) => sum + Number(box.squareMeter || 0), 0)
        .toFixed(2)
    )
  );

  netAmount = computed(() => {
    let finalAmount = this.totalAmount();

    const discountType = this.invoiceForm.get('discountType')?.value;
    const discountValue = Number(
      this.invoiceForm.get('discountValue')?.value || 0
    );

    const additionalChargeType = this.invoiceForm.get(
      'additionalChargeType'
    )?.value;
    const additionalChargeValue = Number(
      this.invoiceForm.get('additionalChargeValue')?.value || 0
    );

    const totalDiscount =
      discountType === 'percentage'
        ? (finalAmount * discountValue) / 100
        : discountType === 'flat'
        ? discountValue
        : 0;

    const totalAddition =
      additionalChargeType === 'percentage'
        ? (finalAmount * additionalChargeValue) / 100
        : additionalChargeType === 'flat'
        ? additionalChargeValue
        : 0;

    finalAmount = finalAmount - totalDiscount + totalAddition;

    const roundedAmount = Math.round(finalAmount);
    const rounding = Number((roundedAmount - finalAmount).toFixed(2));

    this.invoiceForm.patchValue({
      rounding,
      netAmount: roundedAmount,
      totalDiscount: Number(totalDiscount.toFixed(2)),
      totalAddition: Number(totalAddition.toFixed(2)),
    });

    return roundedAmount;
  });

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService
  ) {
    effect(() => {
      this.invoiceForm.patchValue({
        totalQuantity: this.totalQuantity(),
        totalSquareMeters: this.totalSquareMeters(),
        totalAmount: this.totalAmount(),
      });
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.invoiceForm.disable();
    this.invoiceDetailsForm.disable();
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
    this.initInvoiceDetailsForm();
    this.initInvoiceForm();
  }
  initInvoiceForm() {
    const today = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
    this.invoiceForm = this.fb.group({
      invId: [''],
      customerOrderNo: ['111', Validators.required],
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
      discountValue: [0],
      totalDiscount: [0],
      totalAddition: [0],
      additionalChargeType: [''],
      additionalChargeValue: [0],
      reference: [''],
      totalQuantity: [0],
      totalAmount: [0],
      totalSquareMeters: [0],
      rounding: [0],
      netAmount: [0],
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
  }
  initInvoiceDetailsForm(data?: any) {
    this.invoiceDetailsForm = this.fb.group({
      invoiceDetailId: [''],
      invoiceId: [''],
      containerType: ['', Validators.required],
      containerTo: ['10'],
      containerFrom: ['8'],
      length: [20],
      width: [30],
      thickness: [40],
      squareMeter: [20],
      materialGrade: [''],
      brandName: ['vvv'],
      finishType: [''],
      thicknessDetail: ['Single Side'],
      quantity: [10, Validators.required],
      rate: [30, Validators.required],
      remarks: [''],
      designType: [''],
      prefixCode: [''],
      grossWeight: [''],
      netWeight: [''],
      boxType: [''],
      subWeight: [''],
    });
    if (data) this.invoiceDetailsForm.patchValue(data);
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
  selectRowIndex(i: any) {
    this.selectedIndex = i;
    console.log(i);
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
    this.modalService
      .openModal(SelectCustomerComponent, {
        width: '80%',
        height: '90%',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          console.log(result);
          this.initInvoiceForm();
          this.invoiceForm.patchValue(result);
        }
      });
  }
  openInstructionModal() {
    this.modalService
      .openModal(SelectInstructionComponent, {
        width: '80%',
        height: '90%',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          console.log(result);
          this.instructions = [...this.instructions, result];
        }
      });
  }

  selectRowInstruction(i: any) {
    this.selectedIntructionIndex = i;
  }
  addDetailsToTable() {
    this.boxes.set([...this.boxes(), this.invoiceDetailsForm.value]);
    this.initInvoiceDetailsForm(); // Reset form after adding
  }

  deleteRow() {
    if (this.selectedIndex !== null && this.selectedIndex >= 0) {
      const updatedBoxes = this.boxes().filter(
        (_, index) => index !== this.selectedIndex
      );
      this.boxes.set(updatedBoxes);
      this.selectedIndex = updatedBoxes.length - 1;
    }
  }
  deleteInstruction() {
    if (
      this.selectedIntructionIndex !== null &&
      this.selectedIntructionIndex >= 0
    ) {
      const updatedBoxes = this.instructions.filter(
        (_, index) => index !== this.selectedIntructionIndex
      );
      this.instructions = updatedBoxes;
      this.selectedIntructionIndex = updatedBoxes.length - 1;
    }
  }
  copyValue() {
    if (this.selectedIndex !== null && this.selectedIndex >= 0) {
      this.initInvoiceDetailsForm(this.boxes()[this.selectedIndex]);
    }
  }

  moveUp() {
    if (this.selectedIndex !== null && this.selectedIndex > 0) {
      const updatedBoxes = [...this.boxes()];
      [updatedBoxes[this.selectedIndex], updatedBoxes[this.selectedIndex - 1]] =
        [
          updatedBoxes[this.selectedIndex - 1],
          updatedBoxes[this.selectedIndex],
        ];

      this.boxes.set(updatedBoxes); // Signal's `.set()` triggers UI updates
      this.selectedIndex--;
    }
  }

  moveDown() {
    if (
      this.selectedIndex !== null &&
      this.selectedIndex < this.boxes().length - 1
    ) {
      const updatedBoxes = [...this.boxes()];
      [updatedBoxes[this.selectedIndex], updatedBoxes[this.selectedIndex + 1]] =
        [
          updatedBoxes[this.selectedIndex + 1],
          updatedBoxes[this.selectedIndex],
        ];

      this.boxes.set(updatedBoxes); // Signal's `.set()` triggers UI updates
      this.selectedIndex++;
    }
  }

  onSave(isClose = false) {
    if (this.invoiceForm.disabled) {
      this.invoiceForm.enable();
    }
    if (this.invoiceDetailsForm.disabled) {
      this.invoiceDetailsForm.enable();
    }
    if (isClose) this.dialogRef.close(false);
    console.log(this.invoiceForm.value, this.invoiceDetailsForm.value);
  }
}
