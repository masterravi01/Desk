import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: any): void {
    let message = 'An error occurred, please try again later.';
    if (error.status === 0) {
      message = 'Network error, please check your internet connection.';
    } else if (error.status === 500) {
      message = 'Server error, please try again later.';
    }

    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
