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
  MatDialog,
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
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    TextFieldModule,
    FormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './confirm-invoice-modal.component.html',
  styleUrl: './confirm-invoice-modal.component.css',
})
export class ConfirmInvoiceModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ConfirmInvoiceModalComponent>);
  readonly dialog = inject(MatDialog);
  invoiceBottomNotes: any[] = [];
  finalInvoiceForm!: FormGroup;

  displayedColumns: string[] = ['bottomNoteId', 'bottomNote'];
  columnHeaderMap: { [key: string]: string } = {
    bottomNoteId: 'Id',
    bottomNote: 'Bottom Note',
  };
  selectedBottomIndex: number = -1;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private _snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.invoiceBottomNotes = [];
    this.selectedBottomIndex = -1;
    this.initForm();
    this.finalInvoiceForm.disable();
  }

  initForm() {
    const today = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
    this.finalInvoiceForm = this.fb.group({
      id: [''],
      invoiceId: ['', Validators.required],
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
  clearData() {
    this.invoiceBottomNotes = [];
    this.selectedBottomIndex = -1;
    this.initForm();
  }
  onCancel(): void {
    this.dialogRef.close(false);
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
        if (this.finalInvoiceForm.get('id')?.value) {
          this.masterService
            .invoke(
              'deleteFinalInvoice',
              this.finalInvoiceForm.get('invoiceId')?.value
            )
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
    this.finalInvoiceForm.enable();
  }

  openSelectModal(isFinal = false) {
    this.modalService
      .openModal(SelectInvoiceComponent, {
        data: { final: isFinal },
        width: '80%',
        height: '90%',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.invoiceId) {
          console.log(result);
          this.getFinalInvoiceById(result.invoiceId);
        }
      });
  }
  getFinalInvoiceById(invoiceId: any) {
    this.masterService
      .invoke('getInvoice', invoiceId)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.initForm();
        if (data.invoiceMaster?.length) {
          data.invoiceMaster = data.invoiceMaster[0];
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
            dischargeTerms: data.invoiceMaster.dispatchTerms,
            termsOfDp: data.invoiceMaster.paymentTerms,
          });
        }
        this.invoiceBottomNotes = data.invoiceBottomNote;
        if (data.finalInvoice?.length)
          this.finalInvoiceForm.patchValue(data.finalInvoice[0]);

        // this.finalInvoiceForm.get('invoiceId')?.disable();
        // this.invoiceBottomNotes = data.invoiceBottomNote;
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
          if (
            !this.invoiceBottomNotes.find(
              (c) => c.bottomNoteId === result.bottomNoteId
            )
          ) {
            this.invoiceBottomNotes = [...this.invoiceBottomNotes, result];
          }
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
      this.selectedBottomIndex = -1;
    }
  }

  onSave(isClose = false) {
    this.selectedBottomIndex = -1;
    if (this.finalInvoiceForm.disabled) {
      this.finalInvoiceForm.enable();
    }

    if (isClose) this.dialogRef.close(false);

    this.finalInvoiceForm
      .get('invoiceDate')
      ?.setValue(
        this.finalInvoiceForm.get('invoiceDate')?.value
          ? new DatePipe('en-US').transform(
              new Date(this.finalInvoiceForm.get('invoiceDate')?.value),
              'yyyy-MM-dd'
            )
          : ''
      );
    console.log({
      finalinvoice: this.finalInvoiceForm.value,
      invoiceBottomNotes: this.invoiceBottomNotes,
    });
    this.masterService
      .invoke(
        this.finalInvoiceForm.get('id')?.value
          ? 'updateFinalInvoice'
          : 'addFinalInvoice',
        {
          invoice: this.finalInvoiceForm.value,
          invoiceBottomNotes: this.invoiceBottomNotes,
        }
      )
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        if (data.invoiceId) {
          this._snackBar.showSuccess('Data Saved Successfully!');
          this.getFinalInvoiceById(data.invoiceId);
        }
      });
  }

  exportData() {
    const invoiceId = this.finalInvoiceForm.get('invoiceId')?.value;
    if (invoiceId) {
      this.masterService
        .invoke('exportInvoice', invoiceId)
        .pipe(untilDestroyed(this))
        .subscribe((data: any) => {
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = `invoice-${invoiceId}.json`;
          a.click();

          window.URL.revokeObjectURL(url);
        });
    } else {
      this._snackBar.showError('Please Select invoice First !');
    }
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        json.invoiceId = this.finalInvoiceForm.get('invoiceId')?.value
          ? this.finalInvoiceForm.get('invoiceId')?.value
          : '';
        this.masterService
          .invoke('importInvoice', json)
          .pipe(untilDestroyed(this))
          .subscribe((data: any) => {
            console.log(data);
            this._snackBar.showSuccess('Invoice imported successfully!');
            this.getFinalInvoiceById(data.invoiceId);
          });
      } catch (err) {
        console.error('Invalid JSON file', err);

        this._snackBar.showError('Invalid JSON file!');
      }
    };

    reader.readAsText(file);
  }
}
