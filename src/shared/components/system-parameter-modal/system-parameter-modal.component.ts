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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NewCustomerComponent } from '../new-customer/new-customer.component';
import { ModalService } from '../../../core/services/modal.service';
import { NewCurrencyModalComponent } from '../new-currency-modal/new-currency-modal.component';
import { MasterService } from '../../../core/services/master.service';
import { MatCardModule } from '@angular/material/card';
import { NewParameterComponent } from '../new-parameter/new-parameter.component';
import { TableComponent } from '../table/table.component';
import { CommonModule } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'app-system-parameter-modal',
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
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    TableComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './system-parameter-modal.component.html',
  styleUrl: './system-parameter-modal.component.css',
})
export class SystemParameterModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SystemParameterModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  displayedColumns: string[] = ['name', 'email', 'phone'];
  companyForm!: FormGroup;
  parameters = new MatTableDataSource<any>([]);
  companies: any[] = [];
  selectedCompanyId: number | null = null;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCompanies();
    this.loadParameters();
  }

  private initForm() {
    this.companyForm = this.fb.group({
      id: [null],
      companyCode: [''],
      companyName: [''],
      entryDate: [''],
      currencyCode: [''],
      createdBy: [''],
      remarks: [''],
      isCurrentCompany: [0],
      companyAddressLine1: [''],
      companyAddressLine2: [''],
      companyCity: [''],
      companyPostalCode: [''],
      companyCountry: [''],
      companyState: [''],
      telephone: [''],
      email: [''],
      website: [''],
      remark2: [''],
      bankName: [''],
      bankAddressLine1: [''],
      bankAddressLine2: [''],
      bankCity: [''],
      bankPostalCode: [''],
      bankCountry: [''],
      bankState: [''],
      swiftCode: [''],
      accountNumber: [''],
      additionalNumber: [''],
      importExportCode: [''],
      taxIdentificationNumber: [''],
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
            if (this.selectedCompanyId) {
              this.loadCompanyData(this.selectedCompanyId);
            }
          } else {
            console.log('No companies found in database');
          }
        },
        error: (error) => {
          console.error('Error loading companies:', error);
          this.companies = [];
        }
      });
  }

  private loadCompanyData(companyId: number) {
    this.masterService
      .invoke('getCompany', companyId)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log('Company data loaded:', data);
        if (data) {
          this.companyForm.patchValue(data);
          this.companyForm.disable();
        }
      });
  }

  onCompanyChange(companyId: number | null) {
    this.selectedCompanyId = companyId;
    if (companyId) {
      this.loadCompanyData(companyId);
    } else {
      // Reset form when no company is selected
      this.companyForm.reset();
      this.companyForm.disable();
    }
  }

  addNewCompany() {
    this.companyForm.reset();
    this.companyForm.enable();
    this.selectedCompanyId = null;
    // Set default values for new company
    this.companyForm.patchValue({
      isCurrentCompany: 0,
      entryDate: new Date().toISOString().split('T')[0], // Today's date
      createdBy: 'admin' // Default creator
    });
  }

  private loadParameters() {
    this.masterService
      .invoke('getAllSystemParameters')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.parameters = new MatTableDataSource<any>(data);
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  enableEdit() {
    this.companyForm.enable();
  }

  openCustomerModal() {
    this.modalService.openModal(NewCustomerComponent, {
      width: '90%',
      height: '90%',
    });
  }

  openParameterModal(data?: any) {
    this.modalService
      .openModal(NewParameterComponent, {
        width: '50%',
        minHeight: '220px',
        position: { top: '40px' },
        data,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadParameters();
      });
  }

  onSave() {
    if (this.companyForm.disabled) {
      this.companyForm.enable();
    }
    
    const formValue = this.companyForm.value;
    const callUrl = formValue.id ? 'updateCompany' : 'addCompany';
    
    this.masterService
      .invoke(callUrl, formValue)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          console.log('Company saved:', data);
          this.loadCompanies(); // Reload companies list
          // If this was a new company, select it
          if (!formValue.id && data.id) {
            this.selectedCompanyId = data.id;
          }
        },
        error: (error) => {
          console.error('Error saving company:', error);
        }
      });
  }
}
