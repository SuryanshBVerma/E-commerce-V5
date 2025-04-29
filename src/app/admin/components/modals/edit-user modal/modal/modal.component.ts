import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, input, Output, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../../model/user.model';
import { LucideAngularModule, LoaderCircle } from 'lucide-angular';
import { AdminService } from '../../../../services/admin.service';
import { HotToastService } from '@ngxpert/hot-toast';


@Component({
  selector: 'edit-user-modal',
  imports: [
    FormsModule,
    DatePipe,
    LucideAngularModule
  ],
  templateUrl: './modal.component.html',
  styles: ``
})
export class EditUserModalComponent {

  @Input() user: User = {} as User; 
  @Input() isOpen: boolean = false;
  @Input() isSaving : boolean = false;
  @Output() save = new EventEmitter<any>();
  modalClose = output();
  // isSaving = false;


  readonly loader = LoaderCircle;

  selectedUser: any = {};

  constructor(private adminService : AdminService, private toast : HotToastService){ }

  ngOnChanges(): void {
    if (this.user && !this.isSaving) {
      this.selectedUser = { ...this.user };
    }
  }

  openModal(): boolean {
    return this.isOpen;
  }


  saveUser(): void {
    setTimeout(() => {
      this.save.emit(this.selectedUser);
    }, 200);
  }


  closeModal() {
    this.modalClose.emit();
  }

}
