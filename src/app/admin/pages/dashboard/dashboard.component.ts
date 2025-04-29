import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

  stats: any;
  isLoading = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getAdminStats();
  }


  getAdminStats() {
    const token = localStorage.getItem('auth_token');

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    this.http.get('http://localhost:9000/api/admin/stats', {headers}).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        console.log(this.stats);
        
      },
      error: (err) => {
        console.error('Failed to fetch stats:', err);
        this.isLoading = false;
      }
    });
  }

}
