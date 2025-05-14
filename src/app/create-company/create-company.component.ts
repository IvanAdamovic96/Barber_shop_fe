import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarberService } from '../services/barber.service';

@Component({
  selector: 'app-create-company',
  imports: [FormsModule],
  templateUrl: './create-company.component.html',
  styleUrl: './create-company.component.css'
})
export class CreateCompanyComponent implements OnInit {
  companyName: string = '';
  selectedFile: File[] | null = null;

  constructor(private barberService: BarberService) { }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  onFileSelected(event: any): void {
    this.selectedFile = Array.from(event.target.files);
  }

  onSubmit(): void {
    if (!this.companyName || !this.selectedFile) {
      alert('Please enter a name and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('CompanyName', this.companyName);
    //formData.append('Image', this.selectedFile);
    for (let i = 0; i < this.selectedFile.length; i++) {
      formData.append('Image', this.selectedFile[i]); // "Images" je ime polja koje backend očekuje
    }

    this.barberService.createCompany(formData).subscribe({
      next: (response) => {
        console.log('Company created:', response);
        alert('Company successfully created!');
      },
      error: (error) => {
        console.error('Error creating company:', error);
        alert('Error creating company.');
      }
    });
  }
}