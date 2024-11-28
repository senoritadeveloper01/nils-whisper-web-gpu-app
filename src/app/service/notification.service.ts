import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  title = '';
  config = { timeOut: 1000, closeButton: true, positionClass: 'toast-bottom-right', preventDuplicates: true };

  constructor(private toastrService: ToastrService) {}

  showSuccess(message: string): void {
    this.toastrService.clear();
    this.toastrService.success(message, this.title, this.config);
  }

  showError(message: string): void {
    this.toastrService.clear();
    this.toastrService.error(message, this.title, this.config);
    LoggerService.logError(message);
  }

  showInfo(message: string): void {
    this.toastrService.info(message, this.title, this.config);
  }

  showWarning(message: string): void {
    this.toastrService.warning(message, this.title, this.config);
  }

  showCustomError(message: string, title: string): void {
    this.toastrService.error(title, message, this.config);
  }

  showCustomSuccess(message: string, title: string): void {
    this.toastrService.success(title, message, this.config);
  }
}
