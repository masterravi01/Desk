// src/app/shared/services/snackbar.service.ts

import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    this._snackBar.open(message, '✔️', {
      duration: 3000,
      panelClass: ['custom-snackbar-success'], // optional
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  showError(message: string) {
    this._snackBar.open(message, '❌', {
      panelClass: ['custom-snackbar-error'], // optional
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  showInfo(message: string) {
    this._snackBar.open(message, '❌', {
      duration: 3000,
      panelClass: ['custom-snackbar-info'], // optional
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
