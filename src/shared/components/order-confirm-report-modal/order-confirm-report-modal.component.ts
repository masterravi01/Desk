import {
  Component,
  inject,
} from '@angular/core';
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
  FormsModule
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SelectInvoiceComponent } from '../select-invoice/select-invoice.component';
import { CommonModule } from '@angular/common';

@UntilDestroy()

@Component({
  selector: 'app-order-confirm-report-modal',
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
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule
  ],
  templateUrl: './order-confirm-report-modal.component.html',
  styleUrl: './order-confirm-report-modal.component.css'
})
export class OrderConfirmReportModalComponent {
  readonly dialogRef = inject(MatDialogRef<OrderConfirmReportModalComponent>);
  orderForm!: FormGroup;
  reportType: string = 'ms-word';
  companies: any[] = [];
  selectedCompanyId: number | null = null;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCompanies();
    this.orderForm.disable();
  }

  initForm() {
    this.orderForm = this.fb.group({
      customerId: [''],
      customerName: [''],
      invoiceId: [''],
      invoicePiNo: [''],
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
        }
      });
  }


  onCancel(): void {
    this.dialogRef.close(false);
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
          this.initForm();
          this.orderForm.patchValue(result);
          console.log(this.orderForm.value);
        }
      });
  }


  generateDocument(type: any, country?: any) {
    let body = {
      ...this.orderForm.value,
      format: this.reportType,
      companyId: this.selectedCompanyId,
      type,
      country
    };
    console.log(body);
    this.orderForm.disable();

    this.masterService
      .invoke('generateOrderConfirmation', body)
      .pipe(untilDestroyed(this),
        finalize(() => {
          this.orderForm.enable();
        }))
      .subscribe((data: any) => {
        console.log(data);
      });
  }

}
