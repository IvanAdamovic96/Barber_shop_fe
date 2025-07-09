import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MatToolbarModule, MatButtonModule,RouterLink,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BarberVisual';
  isLoggedIn = false;
 constructor(private authService: AuthService,private router: Router) { }


  ngOnInit(): void {
    this.authService.isLoggedin$.subscribe(status=>{
      this.isLoggedIn=status
      console.log(this.isLoggedIn)
    })
  }
  logout(){
    this.authService.logout()
    this.router.navigate(["/companies"])
    
  }

}
