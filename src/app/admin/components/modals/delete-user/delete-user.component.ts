import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../model/user.model';
import { LucideAngularModule, AlertTriangle, LoaderCircle } from 'lucide-angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delete-user',
  imports: [
    LucideAngularModule,
    DatePipe
  ],
  templateUrl: './delete-user.component.html',
  styles: ``
})
export class DeleteUserComponent {

  @Input() user: User = {} as User;
  @Input() isOpen: boolean = false;
  @Input() isDeleting: boolean = false;
  @Output() deleteConfirmed = new EventEmitter<User>();
  @Output() modalClose = new EventEmitter<void>();

  readonly loader = LoaderCircle;
  readonly warningIcon = AlertTriangle;

  openModal(): boolean {
    return this.isOpen;
  }

  confirmDelete(): void {
    this.deleteConfirmed.emit(this.user);
  }

  closeModal(): void {
    this.modalClose.emit();
  }

}
