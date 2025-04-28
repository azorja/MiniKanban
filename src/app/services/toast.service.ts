import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<string[]>([]);

  toasts = this._toasts.asReadonly();

  show(message: string) {
    this._toasts.update(messages => [...messages, message]);
    setTimeout(() => this.remove(message), 3000);
  }

  private remove(message: string) {
    this._toasts.update(messages => messages.filter(m => m !== message));
  }
}
