import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class BarberGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isBarber()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }


  }
}
