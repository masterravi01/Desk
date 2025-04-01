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
import { ModalService } from '../../../core/services/modal.service';
import { MasterService } from '../../../core/services/master.service';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { SelectCustomerComponent } from '../select-customer/select-customer.component';
import { SelectInstructionComponent } from '../select-instruction/select-instruction.component';
import { SelectInvoiceComponent } from '../select-invoice/select-invoice.component';
import { InvoiceDetailsService } from '../../../core/services/invoice-details.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
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
    squareMeter: 'Sq. Mt.',
    materialGrade: 'Grade',
    brandName: 'Brand',
    designType: 'Design',
    finishType: 'Finish',
    thicknessDetail: 'Description',
    quantity: 'Quantity',
    rate: 'Rate',
    prefixCode: 'Prefix',
  };
  calculationForm!: FormGroup;
  selectedIndex: number = 0;
  selectedIntructionIndex: number = 0;

  boxes = signal<any[]>([]); // Using signal for your `boxes` data
  formData = signal({
    discountType: '',
    discountValue: 0,
    additionalChargeType: '',
    additionalChargeValue: 0,
    calculationType: 'Per Sq. Mt',
  });
  // Remove form patching logic from computed signals
  totalQuantity = computed(() =>
    this.boxes().reduce((sum, box) => sum + Number(box.quantity || 0), 0)
  );

  totalAmount = computed(() => {
    const calculationType = this.formData().calculationType;
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

    const discountType = this.formData().discountType;
    const discountValue = Number(this.formData().discountValue || 0);

    const additionalChargeType = this.formData().additionalChargeType;
    const additionalChargeValue = Number(
      this.formData().additionalChargeValue || 0
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

    setTimeout(() => {
      this.invoiceForm.patchValue({
        rounding,
        netAmount: roundedAmount,
        totalDiscount: Number(totalDiscount.toFixed(2)),
        totalAddition: Number(totalAddition.toFixed(2)),
        totalQuantity: this.totalQuantity(),
        totalSquareMeters: this.totalSquareMeters(),
        totalAmount: this.totalAmount(),
      });
    });

    return roundedAmount;
  });

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private invoiceDetailsService: InvoiceDetailsService
  ) { }

  ngOnInit(): void {
    this.instructions = [];
    this.boxes.set([]);
    this.initForm();
    this.invoiceForm.disable();
    this.invoiceDetailsForm.disable();
    this.calculationForm.disable();
    this.loadData();
  }

  initForm() {
    this.initInvoiceForm();
    this.initInvoiceDetailsForm();
    this.initCalculationForm();
  }
  initInvoiceForm() {
    const today = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
    this.invoiceForm = this.fb.group({
      invoiceId: [''],
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
      buyerAddress: [''],
      buyerCity: [''],
      buyerZip: [''],
      buyerState: [''],
      buyerCountry: [''],
      currency: ['USD'],
      status: [''],

      totalDiscount: [0],
      totalAddition: [0],
      reference: [''],
      totalQuantity: [0],
      totalAmount: [0],
      totalSquareMeters: [0],
      rounding: [0],
      netAmount: [0],
      deliveryTerms: [],
      deliveryDetails: [],
      shippingDetails: [],
      paymentTerms: [],
      portOfDischarge: [],
      dispatchTerms: [],
      bankName: [''],
      bankBranch: [''],
      bankCity: [''],
      swiftNumber: [''],
      comments: [''],
      bankAddress: [''],
    });
  }
  initCalculationForm() {
    this.calculationForm = this.fb.group({
      discountType: [''],
      discountValue: [0],
      additionalChargeType: [''],
      additionalChargeValue: [0],
      calculationType: ['Per Sq. Mt'],
    });
    this.calculationForm.valueChanges.subscribe((data) => {
      this.formData.set(data);
    });
  }
  initInvoiceDetailsForm(data?: any) {
    this.invoiceDetailsForm = this.fb.group({
      invoiceDetailId: [''],
      invoiceId: [''],
      customerId: [''],
      containerType: ['', Validators.required],
      containerTo: [''],
      containerFrom: [''],
      length: [0],
      width: [0],
      thickness: [0],
      squareMeter: [0],
      materialGrade: [''],
      brandName: [''],
      finishType: [''],
      thicknessDetail: ['Single Side'],
      quantity: [0, Validators.required],
      rate: [0, Validators.required],
      remarks: [''],
      designType: [''],
      prefixCode: [''],
      grossWeight: [''],
      netWeight: [''],
      boxType: [''],
      subWeight: [''],
    });
    if (data) this.invoiceDetailsForm.patchValue(data);
    this.invoiceDetailsForm.patchValue({
      invoiceDetailId: '',
      invoiceId: '',
    });
    this.invoiceDetailsForm
      .get('customerId')
      ?.patchValue(this.invoiceForm.get('customerId')?.value);
    this.invoiceDetailsForm
      .get('materialGrade')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((materialGrade) => {
        const customerId = this.invoiceDetailsForm.get('customerId')?.value;
        console.log(materialGrade, customerId);
        if (materialGrade && customerId) {
          this.invoiceDetailsService.setSearchParams({
            materialGrade,
            customerId,
          });
        }
      });

    this.invoiceDetailsService.getSearchResults().subscribe({
      next: (result) => {
        console.log(result);
        if (result && result?.length) {
          this.invoiceDetailsForm.patchValue({
            ...result[0],
            invoiceDetailId: '',
          });
        }
      },
      error: () => {
        console.warn('No matching data found.');
      },
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
  selectRowIndex(i: any) {
    this.selectedIndex = i;
  }
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDelete(): void {
    if (this.invoiceForm.get('invoiceId')?.value) {
      this.masterService
        .invoke('deleteInvoice', this.invoiceForm.get('invoiceId')?.value)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          console.log(data);
          this.ngOnInit();
        });
    } else {
      this.ngOnInit();
    }

    // this.dialogRef.close(true);
  }
  enableEdit() {
    this.invoiceForm.enable();
  }
  getInvoiceById(invoiceId: any) {
    this.masterService
      .invoke('getInvoice', invoiceId)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.initForm();
        if (data.invoiceMaster?.length) {
          this.invoiceForm.patchValue(data.invoiceMaster[0]);
          this.invoiceDetailsForm
            .get('customerId')
            ?.patchValue(data.invoiceMaster[0].customerId);
          this.calculationForm.patchValue(data.invoiceMaster[0]);
        }

        this.boxes.set(data.invoiceDetails);
        this.instructions = data.invoiceInstruction;
      });
  }
  openSelectModal() {
    this.modalService
      .openModal(SelectInvoiceComponent, {
        data: { final: false },
        width: '80%',
        height: '90%',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.invoiceId) {
          console.log(result);
          this.getInvoiceById(result.invoiceId);
        }
      });
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
          // this.initInvoiceForm();
          this.invoiceForm.patchValue(result);
          this.invoiceDetailsForm
            .get('customerId')
            ?.patchValue(result.customerId);
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
          if (!this.instructions.find((c) => c.instructionId === result.instructionId)) {
            this.instructions = [...this.instructions, result];
          }
        }
      });
  }

  selectRowInstruction(i: any) {
    this.selectedIntructionIndex = i;
  }
  addDetailsToTable() {
    this.boxes.update((prev) => [...prev, this.invoiceDetailsForm.value]);

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
    console.log({
      invoiceMaster: {
        ...this.invoiceForm.value,
        ...this.calculationForm.value,
      },
      invoiceDetails: this.boxes(),
      invoiceInstruction: this.instructions,
    });
    this.masterService
      .invoke(
        this.invoiceForm.get('invoiceId')?.value
          ? 'updateInvoice'
          : 'insertInvoice',
        {
          invoiceMaster: {
            ...this.invoiceForm.value,
            ...this.calculationForm.value,
          },
          invoiceDetails: this.boxes(),
          invoiceInstruction: this.instructions,
        }
      )
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        if (data.invoiceId) {
          this.getInvoiceById(data.invoiceId);
        }
      });
  }
}
