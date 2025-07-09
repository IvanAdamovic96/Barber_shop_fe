import { Component, OnInit } from '@angular/core';
import { BarberService } from '../services/barber.service';
import { CommonModule, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-companies',
  imports: [CommonModule, RouterLink, NgIf, NgFor],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent implements OnInit {

  companies: any[] = [];
  isLoggedIn = false;
  isAdmin = false;

  constructor(private barberService: BarberService,private authService : AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedin$.subscribe(status=>{
      this.isLoggedIn = status

    })
    this.isAdmin=this.authService.isAdmin();
    
    this.barberService.getAllCompanies().subscribe({
      next: (data) => {
        this.companies = data.map(company => ({
          ...company,
          // Ako je imageUrl string → pretvori u niz sa jednom slikom
          imageUrl: typeof company.imageUrl === 'string' ? [company.imageUrl] : (company.imageUrl ?? []),
          currentImageIndex: 0
        }));


        console.log(this.companies);
      },
      error: (err) => {
        console.error('Greška prilikom dohvatanja kompanija', err);
      }
    });
  }
  nextImage(company: any) {
    if (company.imageUrl.length === 0) return;
    company.currentImageIndex = (company.currentImageIndex + 1) % company.imageUrl.length;
  }

  prevImage(company: any) {
    if (company.imageUrl.length === 0) return;
    company.currentImageIndex = (company.currentImageIndex - 1 + company.imageUrl.length) % company.imageUrl.length;
  }

  /* getImageSrc(driveLink: string): string {
    if (!driveLink) return ''; // Ako je null ili undefined, vrati prazan string

    const match = driveLink.match(/\/d\/(.+?)\//);
    const id = match ? match[1] : '';
    return id ? `https://drive.google.com/uc?export=view&id=${id}` : '';
  } */
}
