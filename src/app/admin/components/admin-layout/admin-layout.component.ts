import { Component } from '@angular/core';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [
    SideBarComponent,
    RouterOutlet,
  ],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {

}
