import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { BarberService } from '../services/barber.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { showConfirm, showError, showSuccess } from '../../utils';
import { Router } from '@angular/router';

interface DisplayFile {
  file: File;
  name: string;
  size: string;
  url: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-create-company',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-company.component.html',
  styleUrl: './create-company.component.css'
})
export class CreateCompanyComponent implements OnInit {
  companyName: string = '';
  //selectedFile: File[] | null = null;
  uploadedFiles: DisplayFile[] = [];
  isDragging: boolean = false;

  constructor(private barberService: BarberService, private router: Router) { }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }



  onSubmit(): void {
    if (!this.companyName) {
      showError('Morate uneti naziv kompanije!');
      return;
    } else if (!this.uploadedFiles) {
      showError('Morate ubaciti barem jednu sliku!');
      return;
    }

    const formData = new FormData();

    formData.append('CompanyName', this.companyName);

    this.uploadedFiles.forEach(displayFile => {
      formData.append('Image', displayFile.file, displayFile.name);
    });

    showConfirm('Da li ste sigurni da želite da kreirate kompaniju sa ovim podacima?', async () => {
      this.barberService.createCompany(formData).subscribe({
        next: (response) => {
          this.router.navigate(['/companies']);
          console.log('Company created:', response);
          showSuccess('Kompanija uspešno kreirana.');
        },
        error: (error) => {
          showError('Došlo je do greške prilikom kreiranja kompanije.');
          console.error('Error creating company:', error);
        }
      });
    })
    /*
    for (let i = 0; i < this.selectedFile.length; i++) {
      formData.append('Image', this.selectedFile[i]);
    }
    */

  }


  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  //treba fix za drag and drop da se napravi - ne registruju se drop-ovani fajlovi kad se posalje form
  @HostListener('drop', ['$event']) onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
  }

  onFileSelected(event: any): void {
    //this.selectedFile = Array.from(event.target.files);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(input.files);
    }
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