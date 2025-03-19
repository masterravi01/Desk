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
  selector: 'app-new-parameter',
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
  templateUrl: './new-parameter.component.html',
  styleUrl: './new-parameter.component.css',
})
export class NewParameterComponent {
  parameterForm: FormGroup;
  readonly dialogRef = inject(MatDialogRef<NewParameterComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  constructor(private fb: FormBuilder, private masterService: MasterService) {
    this.parameterForm = this.fb.group({
      id: [0],
      parameterName: [''],
      parameterValue: [''],
    });
    console.log(this.data);
    if (this.data?.id) {
      this.parameterForm.patchValue(this.data);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    const callUrl = this.parameterForm.get('id')?.value
      ? 'updateSystemParameter'
      : 'addSystemParameter';
    this.masterService
      .invoke(callUrl, this.parameterForm.value)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        console.log(data);
        this.dialogRef.close(true);
      });
  }
  onDelete() {
    if (this.parameterForm.get('id')?.value) {
      this.masterService
        .invoke('deleteSystemParameter', this.parameterForm.get('id')?.value)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          console.log(data);
          this.dialogRef.close(true);
        });
    } else {
      this.dialogRef.close(true);
    }
  }
}
