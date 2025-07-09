import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { BarberService } from '../services/barber.service';
import { NgFor, NgIf } from '@angular/common';
interface DisplayFile {
    file: File;
    name: string;
    size: string;
    url: string | ArrayBuffer | null;
}
@Component({
  selector: 'app-create-company',
 imports: [FormsModule,NgIf,NgFor],
  templateUrl: './create-company.component.html',
  styleUrl: './create-company.component.css'
 
})



export class CreateCompanyComponent implements OnInit {
companyName: string = '';
  selectedFile: File[] | null = null;
  uploadedFiles: DisplayFile[]=[];

  constructor(private barberService: BarberService) {}
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  onFileSelected(event: any): void {
    this.selectedFile = Array.from(event.target.files);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(input.files);
    }
  }

  onSubmit(): void {
    if (!this.companyName || !this.selectedFile) {
      alert('Please enter a name and select an image.');
      return;
    }

    const formData = new FormData();
    
    formData.append('CompanyName', this.companyName);

    for(let i=0;i<this.selectedFile.length;i++){
     formData.append('Image', this.selectedFile[i]);

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

  private processFiles(fileList: FileList): void {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.startsWith('image/')) {
        
        continue;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.uploadedFiles.push({
          file: file,
          name: file.name,
          size: this.formatFileSize(file.size),
          url: reader.result as string || null
        });
      };
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }


}