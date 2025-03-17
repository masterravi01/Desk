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
import { SelectInvoiceComponent } from '../select-invoice/select-invoice.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectBottomNoteComponent } from '../select-bottom-note/select-bottom-note.component';

@UntilDestroy()
@Component({
  selector: 'app-confirm-invoice-modal',
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
    MatCheckboxModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './confirm-invoice-modal.component.html',
  styleUrl: './confirm-invoice-modal.component.css',
})
export class ConfirmInvoiceModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ConfirmInvoiceModalComponent>);
  invoiceBottomNotes: any[] = [];
  finalInvoiceForm!: FormGroup;

  displayedColumns: string[] = ['bottomNoteId', 'bottomNote'];
  columnHeaderMap: { [key: string]: string } = {
    bottomNoteId: 'Id',
    bottomNote: 'Bottom Note',
  };
  selectedBottomIndex: number = 0;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.finalInvoiceForm.disable();
  }

  initForm() {
    const today = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
    this.finalInvoiceForm = this.fb.group({
      invoiceId: [''],
      customerName: [''],
      buyerName: [''],
      buyerAddress: [''],
      buyerCity: [''],
      buyerZip: [''],
      buyerState: [''],
      buyerCountry: [''],
      consigneeName: [''],
      consigneeAddress: [''],
      consigneeCity: [''],
      consigneeZip: [''],
      consigneeState: [''],
      consigneeCountry: [''],
      bankName: [''],
      bankAddress: [''],
      bankCity: [''],
      bankZip: [''],
      bankState: [''],
      bankCountry: [''],
      bankAsConsignee: [0],
      termsOfDp: [''],
      deliveryTerms: [''],
      precarriage: [''],
      vesselNo: [''],
      portOfDischarge: [''],
      originOfGoods: [''],
      receiptPlace: [''],
      loadingPort: [''],
      finalDestination: [''],
      dischargeTerms: [''],
      privateRemark: [''],
      bottomNote: [''],
      bankShortName: [''],
      branchName: [''],
      city: [''],
      panNo: [''],
      adCode: [''],
      acCode: [''],
      iec: [''],
      comment: [''],
      invoiceDate: [today],
      finalInvoice: [''],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDelete(): void {
    if (this.finalInvoiceForm.get('invoiceId')?.value) {
      this.masterService
        .invoke('deleteInvoice', this.finalInvoiceForm.get('invoiceId')?.value)
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
    this.finalInvoiceForm.enable();
  }

  openSelectModal() {
    this.modalService
      .openModal(SelectInvoiceComponent, {
        width: '80%',
        height: '90%',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.invoiceId) {
          console.log(result);
          this.masterService
            .invoke('getInvoice', result.invoiceId)
            .pipe(untilDestroyed(this))
            .subscribe((data: any) => {
              console.log(data);
              this.initForm();
              this.finalInvoiceForm.patchValue(data.invoiceMaster);
              this.finalInvoiceForm
                .get('invoiceId')
                ?.patchValue(data.invoiceMaster.invoiceId);
              this.finalInvoiceForm.patchValue({
                consigneeName: data.invoiceMaster.customerName,
                consigneeAddress: data.invoiceMaster.customerAddress,
                consigneeCity: data.invoiceMaster.customerCity,
                consigneeZip: data.invoiceMaster.customerZip,
                consigneeState: data.invoiceMaster.customerState,
                consigneeCountry: data.invoiceMaster.customerCountry,
              });
              if (data.finalInvoice)
                this.finalInvoiceForm.patchValue(data.finalInvoice);
              // this.finalInvoiceForm.get('invoiceId')?.disable();
              // this.invoiceBottomNotes = data.invoiceBottomNote;
            });
        }
      });
  }

  openBottomNoteModal() {
    this.modalService
      .openModal(SelectBottomNoteComponent, {
        width: '80%',
        height: '90%',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          console.log(result);
          this.invoiceBottomNotes = [...this.invoiceBottomNotes, result];
        }
      });
  }

  selectRowBottomNote(i: any) {
    this.selectedBottomIndex = i;
  }

  deleteBottomNote() {
    if (this.selectedBottomIndex !== null && this.selectedBottomIndex >= 0) {
      const updatedBoxes = this.invoiceBottomNotes.filter(
        (_, index) => index !== this.selectedBottomIndex
      );
      this.invoiceBottomNotes = updatedBoxes;
      this.selectedBottomIndex = updatedBoxes.length - 1;
    }
  }

  onSave(isClose = false) {
    if (this.finalInvoiceForm.disabled) {
      this.finalInvoiceForm.enable();
    }

    if (isClose) this.dialogRef.close(false);
    console.log(this.finalInvoiceForm.value);
    this.masterService
      .invoke(
        this.finalInvoiceForm.get('invoiceId')?.value
          ? 'addFinalInvoice'
          : 'addFinalInvoice',
        this.finalInvoiceForm.value
      )
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        console.log(data);
      });
  }
}
