import {
  Component,
  EventEmitter,
  inject,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '../../../core/services/master.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy(this)
@Component({
  selector: 'app-new-currency-modal',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './new-currency-modal.component.html',
  styleUrl: './new-currency-modal.component.css',
})
export class NewCurrencyModalComponent {
  currencyForm: FormGroup;

  readonly data = inject<any>(MAT_DIALOG_DATA);
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewCurrencyModalComponent>,
    private masterService: MasterService
  ) {
    this.currencyForm = this.fb.group({
      id: [0],
      currencyName: [''],
      currencyChar: [''],
      currencyCountry: [''],
    });
    console.log(this.data);
    if (this.data?.id) {
      this.currencyForm.patchValue(this.data);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    const callUrl = this.currencyForm.get('id')?.value
      ? 'updateCurrency'
      : 'addCurrency';
    this.masterService
      .invoke(callUrl, this.currencyForm.value)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        console.log(data);
      });

    this.dialogRef.close(this.currencyForm.value);
  }
}
