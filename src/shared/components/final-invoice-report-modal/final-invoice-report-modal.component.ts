import { Component, inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
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
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
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
import { CommonModule } from '@angular/common';

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
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
  ],
  templateUrl: './final-invoice-report-modal.component.html',
  styleUrl: './final-invoice-report-modal.component.css',
})
export class FinalInvoiceReportModalComponent {
  readonly dialogRef = inject(MatDialogRef<FinalInvoiceReportModalComponent>);
  invoiceForm!: FormGroup;
  reportType: string = 'ms-word';
  documentType: string = 'custom';
  isThreeDigit: string = 'three';
  companies: any[] = [];
  selectedCompanyId: number | null = null;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCompanies();
    this.invoiceForm.disable();
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      customerId: [''],
      customerName: [''],
      invoiceId: [''],
      finalInvoice: [''],
      isSqMt: [false],
    });
  }

  private loadCompanies() {
    this.masterService
      .invoke('getAllCompanies')
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          console.log('Companies loaded:', data);
          this.companies = data || [];
          if (this.companies.length > 0) {
            this.selectedCompanyId = this.companies[0].id;
          }
        },
        error: (error) => {
          console.error('Error loading companies:', error);
          this.companies = [];
        },
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
      isThreeDigit: this.isThreeDigit === 'three' ? true : false,
      document: template,
      country,
      companyId: this.selectedCompanyId,
    };

    console.log(body);
    this.invoiceForm.disable();
    this.masterService
      .invoke('generateInvoiceDocument', body)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this.invoiceForm.enable();
        }),
      )
      .subscribe((data: any) => {
        console.log(data);
      });
  }
}
