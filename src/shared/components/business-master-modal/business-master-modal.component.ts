import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { NewCustomerComponent } from '../new-customer/new-customer.component';
import { ModalService } from '../../../core/services/modal.service';
import { ContainerModalComponent } from '../container-modal/container-modal.component';
import { NewCurrencyModalComponent } from '../new-currency-modal/new-currency-modal.component';
import { SingleParamenterComponent } from '../single-paramenter/single-paramenter.component';
import { MasterService } from '../../../core/services/master.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-business-master-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatTableModule,
    MatTabsModule,
  ],
  templateUrl: './business-master-modal.component.html',
  styleUrl: './business-master-modal.component.css',
})
export class BusinessMasterModalComponent {
  readonly dialogRef = inject(MatDialogRef<BusinessMasterModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  displayedColumns: string[] = ['Name', 'Phone', 'Email', 'Contact Person', 'Designation',
    'Other Phone', 'URL', 'Fax', 'Remark', 'Address',
    'City', 'State', 'Zip', 'Country', 'Buyer Address',
    'Buyer City', 'Buyer State', 'Buyer Zipcode', 'Buyer Country', 'Bank Name',
    'Bank Branch', 'Bank City', 'Bank Address', 'Bank State', 'Bank Zip',
    'Bank Country'];
  customers = [];
  instructions = [];
  containers = [];
  currency = [];
  bottomNote = [];

  constructor(
    private modalService: ModalService,
    private masterService: MasterService
  ) { }

  ngOnInit() {
    this.loadCustomers();
  }

  onTabChange(event: any) {
    let tab = event.tab.textLabel || "Customer";
    if (tab == "Customer") this.loadCustomers();
    if (tab == "Containers") this.loadContainer();
    if (tab == "Bottom Note") this.loadBottomNote();
    if (tab == "Currency") this.loadCurrency();
    if (tab == "Instruction") this.loadInstruction();
  }

  loadCustomers() {
    this.masterService
      .invoke('getAllCustomers')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        this.customers = data;
        console.log(data);

      });
  }

  loadBottomNote() {
    this.masterService
      .invoke('getAllBottomNote')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        this.bottomNote = data;
      });
  }

  loadInstruction() {
    this.masterService
      .invoke('getAllInstruction')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        this.instructions = data;
      });
  }

  loadContainer() {
    this.masterService
      .invoke('getAllContainer')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        this.containers = data;
        console.log(data);
      });
  }

  loadCurrency() {
    this.masterService
      .invoke('getAllCurrencies')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.currency = data;
      });
  }

  onCancel(): void {
    this.dialogRef.close(false); // Return false on cancel
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Return true on confirm
  }
  openCustomerModal(data?: any) {
    this.modalService.openModal(NewCustomerComponent, {
      width: '80%',
      height: '90%',
      data
    }).afterClosed()
      .subscribe((result) => {
        if (result) this.loadCustomers();
      });
  }
  openContainerModal(data?: any) {
    this.modalService.openModal(ContainerModalComponent, {
      width: '50%',
      height: '90%',
      position: {
        top: '40px',
      },
      data
    }).afterClosed()
      .subscribe((result) => {
        if (result) this.loadContainer();
      });
  }

  openCurrencyModal(data?: any) {
    this.modalService
      .openModal(NewCurrencyModalComponent, {
        width: '50%',
        minHeight: '300px',
        position: { top: '40px' },
        data,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadCurrency();
      });
  }

  openBottomNoteModal(note?: any) {
    const dialogRef = this.modalService.openModal(SingleParamenterComponent, {
      width: '50%',
      height: '300px',
      position: { top: '40px' },
      data: {
        title: note ? 'Edit Bottom Note' : 'New Bottom Note',
        parameter: 'Bottom Note',
        info: note ? {
          id: note.BID,
          value: note.BottomNote
        } : '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.delete) {
          console.log('Deleting Bottom Note:', result);
          this.masterService
            .invoke('deleteBottomNote', result)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.loadBottomNote();
            });
        } else {
          let action = note ? 'updateBottomNote' : 'addBottomNote';
          console.log('Bottom Note Saved:', result);
          this.masterService
            .invoke(action, result)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.loadBottomNote();
            });
        }
      }
    });
  }


  openInstructionModal(instruction?: any) {
    const dialogRef = this.modalService.openModal(SingleParamenterComponent, {
      width: '50%',
      height: '300px',
      position: { top: '40px' },
      data: {
        title: instruction ? 'Edit Instruction' : 'New Instruction',
        parameter: 'Instruction',
        info: instruction ? {
          id: instruction.BID,
          value: instruction.Instruction
        } : '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.delete) {
          console.log('Deleting Instruction:', result);
          this.masterService
            .invoke('deleteInstruction', result)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.loadInstruction();
            });
        } else {
          let action = instruction ? 'updateInstruction' : 'addInstruction';
          console.log('Instruction Saved:', result);
          this.masterService
            .invoke(action, result)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.loadInstruction();
            });
        }
      }
    });
  }
}
