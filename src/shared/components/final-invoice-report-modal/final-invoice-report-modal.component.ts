import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalService } from '../../../core/services/modal.service';
import { MasterService } from '../../../core/services/master.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SelectInvoiceComponent } from '../select-invoice/select-invoice.component';

@UntilDestroy()
@Component({
  selector: 'app-final-invoice-report-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatTableModule,
    MatTabsModule,
    MatDividerModule,
    MatRadioModule,
  ],
  templateUrl: './final-invoice-report-modal.component.html',
  styleUrl: './final-invoice-report-modal.component.css',
})
export class FinalInvoiceReportModalComponent {
  readonly dialogRef = inject(MatDialogRef<FinalInvoiceReportModalComponent>);
  invoiceForm!: FormGroup;
  reportType: string = 'ms-word';
  documentType: string = 'custom';

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.invoiceForm.disable();
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      customerId: [''],
      customerName: [''],
      invoiceId: [''],
      finalInvoice: [''],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  openSelectModal() {
    this.modalService
      .openModal(SelectInvoiceComponent, {
        data: { final: true },
        width: '80%',
        height: '90%',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.invoiceId) {
          console.log(result);
          this.initForm();
          this.invoiceForm.patchValue(result);
          console.log(this.invoiceForm.value);
        }
      });
  }

  generateInvoice(template: any, country: any = '') {
    let body = {
      ...this.invoiceForm.value,
      format: this.reportType,
      type: this.documentType,
      document: template,
      country,
    };
    console.log(body);

    this.masterService
      .invoke('generateInvoiceDocument', body)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
      });
  }
}
