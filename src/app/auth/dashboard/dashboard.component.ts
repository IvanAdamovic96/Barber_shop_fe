import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isAdmin = false;
  isOwner = false;
  isBarber = false;
  isRegisteredUser = false;

  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isOwner = this.authService.isOwner();
    this.isBarber = this.authService.isBarber();
    this.isRegisteredUser = this.authService.isRegisteredUser();

    if (this.router.url === '/dashboard' || this.router.url === '/dashboard/') {
      if (this.isAdmin) {
        this.router.navigate(['/dashboard/home']);
      } else if (this.isOwner) {
        this.router.navigate(['/dashboard/barbers']);
      } else if (this.isRegisteredUser) {
        this.router.navigate(['/dashboard/reservations']);
      } else if (this.isBarber) {
        this.router.navigate(['/dashboard/barber-appointments']);
      } else {
        this.router.navigate(['/dashboard/home']);
      }

      // else if (this.authService.hasRole('ClientUser')) {
      //   this.router.navigate(['/dashboard/my-profile']);
      // }
    }
  }


  logout() {
    this.authService.logout()
    this.router.navigate(["/home"])
  }

}
