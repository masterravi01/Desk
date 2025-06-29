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
  MatDialog,
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
  FormsModule,
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
import { combineLatest } from 'rxjs';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    TextFieldModule,
    FormsModule,
    ConfirmDialogComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './order-confirm-modal.component.html',
  styleUrl: './order-confirm-modal.component.css',
})
export class OrderConfirmModalComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<OrderConfirmModalComponent>);
  invoiceForm!: FormGroup;
  invoiceDetailsForm!: FormGroup;
  currencies: any[] = [];
  instructions: any[] = [];
  containers: any[] = [];
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
  selectedIndex: number = -1;
  selectedIntructionIndex: number = -1;

  boxes = signal<any[]>([]); // Using signal for your `boxes` data
  formData = signal({
    discountType: '',
    discountValue: 0,
    additionalChargeType: '',
    additionalChargeValue: 0,
    calculationType: 'Per Sheet',
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
        return Math.round((sum + rate * squareMeter) * 100) / 100;
      } else if (calculationType === 'Per Sheet') {
        return Math.round((sum + rate * quantity) * 100) / 100;
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
    private invoiceDetailsService: InvoiceDetailsService,
    private _snackBar: SnackbarService
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
      transportationMode: [],
      deliveryAt: [],
      paymentTerms: [],
      portOfDischarge: [],
      dispatchTerms: [],
      bankName: ['STATE BANK OF INDIA'],
      bankBranch: ['T.F.C.P.C'],
      bankCity: [''],
      swiftNumber: ['SBIN IN BB 598'],
      comments: [''],
      bankAddress: ['VIIDYAPTIH , AHMEDABAD'],
      fsc: [''],
      specialInstruction: [''],
    });
  }
  initCalculationForm() {
    this.calculationForm = this.fb.group({
      discountType: [''],
      discountValue: [0],
      additionalChargeType: [''],
      additionalChargeValue: [0],
      calculationType: ['Per Sheet'],
    });
    this.calculationForm.valueChanges.subscribe((data) => {
      this.formData.set(data);
    });
  }
  initInvoiceDetailsForm(data?: any) {
    // Step 1: Initialize form
    this.invoiceDetailsForm = this.fb.group({
      invoiceDetailId: [''],
      invoiceId: [''],
      customerId: [''],
      containerType: ['', Validators.required],
      containerTo: [],
      containerFrom: [],
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
    });

    // Step 2: Set customerId from parent form
    this.invoiceDetailsForm
      .get('customerId')
      ?.patchValue(this.invoiceForm.get('customerId')?.value);

    // Step 3: Listen to designType changes (after form init)
    // this.invoiceDetailsForm
    //   .get('designType')
    //   ?.valueChanges.pipe(debounceTime(500))
    //   .subscribe((designType) => {
    //     const customerId = this.invoiceDetailsForm.get('customerId')?.value;
    //     if (designType && customerId) {
    //       this.invoiceDetailsService.setSearchParams({
    //         designType,
    //         customerId,
    //       });
    //     }
    //   });

    // Step 4: Auto-calculate square meter
    combineLatest([
      this.invoiceDetailsForm.get('length')!.valueChanges,
      this.invoiceDetailsForm.get('width')!.valueChanges,
      this.invoiceDetailsForm.get('quantity')!.valueChanges,
    ]).subscribe(([length, width, quantity]) => {
      const squareMeter =
        length && width && quantity
          ? parseFloat(((length * width * quantity) / 10000 / 100).toFixed(4))
          : 0;
      this.invoiceDetailsForm
        .get('squareMeter')
        ?.setValue(squareMeter, { emitEvent: false });
    });

    // Step 5: Patch incoming data (after subscriptions)
    if (data) {
      this.invoiceDetailsForm.patchValue(data);

      // 🔁 Recalculate square meter manually after patch
      const { length, width, quantity } = this.invoiceDetailsForm.value;
      const squareMeter =
        length && width && quantity
          ? parseFloat(((length * width * quantity) / 10000 / 100).toFixed(4))
          : 0;
      this.invoiceDetailsForm
        .get('squareMeter')
        ?.setValue(squareMeter, { emitEvent: false });
    }

    // Step 6: Reset specific fields regardless
    this.invoiceDetailsForm.patchValue({
      invoiceDetailId: '',
      invoiceId: '',
    });

    // Step 7: Fetch matched data (optional auto-fill)
    this.invoiceDetailsService.getSearchResults().subscribe({
      next: (result) => {
        if (result?.length) {
          let original = result[0];
          [
            'invoiceId',
            'containerTo',
            'containerFrom',
            'prefixCode',
            'grossWeight',
            'netWeight',
            'remarks',
            'quantity',
          ].forEach((k) => delete original[k]);

          this.invoiceDetailsForm.patchValue({
            ...original,
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
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
  onRowClick(i: any) {
    if (this.selectedIndex !== i) {
      this.boxes.set([...this.boxes()]);
      this.selectedIndex = i;
    }
  }
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete invoice?',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
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
      } else {
        console.log('User cancelled');
      }
    });
  }
  enableEdit() {
    this.invoiceForm.enable();
  }
  updateSquareMeter(index: number) {
    const currentBoxes = this.boxes();
    const row = currentBoxes[index];
    const length = parseFloat(row.length) || 0;
    const width = parseFloat(row.width) || 0;
    const quantity = parseFloat(row.quantity) || 0;

    row.squareMeter =
      length && width && quantity
        ? parseFloat(((length * width * quantity) / 10000 / 100).toFixed(4))
        : 0;
    this.boxes.set([...currentBoxes]); // Trigger signal update
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
        // const containerObj: Record<string, any> = {};

        // // Mapping containers by container name
        // this.containers.forEach((c: any) => {
        //   if (c?.containerName) {
        //     containerObj[c.containerName] = c;
        //   }
        // });
        // data.invoiceDetails.forEach((inv: any) => {
        //   const container = inv.containerType
        //     ? containerObj[inv.containerType] || {}
        //     : {};
        //   let { length = 0, width = 0, height = 0 } = container;
        //   inv.length = length;
        //   inv.width = width;
        //   inv.thickness = height;
        // });
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
          this.masterService
            .invoke('getInstructionsByCustomer', result.customerId)
            .pipe(untilDestroyed(this))
            .subscribe((data: any) => {
              console.log(data);
              this.instructions = data || [];
              // this.currencies = data;
            });
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
          if (
            !this.instructions.find(
              (c) => c.instructionId === result.instructionId
            )
          ) {
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
    const currentBoxes = this.boxes();

    const firstEntry =
      currentBoxes.length > 0 ? currentBoxes[currentBoxes.length - 1] : null;
    this.initInvoiceDetailsForm();

    if (firstEntry) {
      this.invoiceDetailsForm.patchValue({
        containerType: firstEntry.containerType,
        prefixCode: firstEntry.prefixCode,
        length: firstEntry.length,
        width: firstEntry.width,
        thickness: firstEntry.thickness,
      });
    }
  }

  deleteRow() {
    if (this.selectedIndex !== null && this.selectedIndex >= 0) {
      const updatedBoxes = this.boxes().filter(
        (_, index) => index !== this.selectedIndex
      );
      this.boxes.set(updatedBoxes);
      this.selectedIndex = -1;
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
      this.selectedIntructionIndex = -1;
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
  clearData() {
    this.initForm();
    this.instructions = [];
    this.boxes.set([]);
    this.formData.set({
      discountType: '',
      discountValue: 0,
      additionalChargeType: '',
      additionalChargeValue: 0,
      calculationType: 'Per Sheet',
    });
    this.selectedIntructionIndex = -1;
    this.selectedIndex = -1;
  }
  onSave(isClose = false) {
    this.selectedIntructionIndex = -1;
    this.selectedIndex = -1;
    if (this.invoiceForm.disabled) {
      this.invoiceForm.enable();
    }
    if (this.invoiceDetailsForm.disabled) {
      this.invoiceDetailsForm.enable();
    }
    if (isClose) this.dialogRef.close(false);
    this.invoiceForm
      .get('invoiceDate')
      ?.setValue(
        this.invoiceForm.get('invoiceDate')?.value
          ? new DatePipe('en-US').transform(
            new Date(this.invoiceForm.get('invoiceDate')?.value),
            'yyyy-MM-dd'
          )
          : ''
      );

    let invoiceDetails = this.boxes(); // Getting list of invoice items

    invoiceDetails.forEach((inv: any, index) => {
      const width = Number(inv.width) || 0;
      const length = Number(inv.length) || 0;
      const height = Number(inv.thickness) || 0;
      const quantity = Number(inv.quantity) || 0;

      const volume = width * length * height;
      const density = 1410;
      const weightInGrams = volume * quantity * density;
      const weightInTons = weightInGrams / 1000000000;

      inv.netWeight = Math.round(weightInTons); // You round to the nearest whole number
      inv.tableIndex = index;
      inv.containerTo =
        inv.containerTo === inv.containerFrom ? '' : inv.containerTo;
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
          invoiceDetails: invoiceDetails,
          invoiceInstruction: this.instructions,
        }
      )
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        if (data.invoiceId) {
          this._snackBar.showSuccess('Data Saved Successfully!');
          this.getInvoiceById(data.invoiceId);
        }
      });
  }
}
