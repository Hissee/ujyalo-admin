import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  constructor() {}

  show(title: string, message: string, confirmText: string = 'Confirm', cancelText: string = 'Cancel'): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmed = window.confirm(`${title}\n\n${message}\n\nClick OK to ${confirmText.toLowerCase()} or Cancel to ${cancelText.toLowerCase()}.`);
      resolve(confirmed);
    });
  }
}

