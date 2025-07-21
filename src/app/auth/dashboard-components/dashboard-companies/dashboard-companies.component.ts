import { Component, HostListener, NgModule, OnInit } from '@angular/core';
import { BarberService } from '../../../services/barber.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { showConfirm, showError, showSuccess } from '../../../../utils';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyConfigModel } from '../../../models/company.config';


interface DisplayFile {
  file: File;
  name: string;
  size: string;
  url: string | ArrayBuffer | null;
}


@Component({
  selector: 'app-dashboard-companies',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard-companies.component.html',
  styleUrl: './dashboard-companies.component.css'
})
export class DashboardCompaniesComponent implements OnInit {

  companies: CompanyConfigModel[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  selectedCompanyForEdit: CompanyConfigModel | null = null;
  isEditing: boolean = false;
  isLoadingCompanyForEdit: boolean = false;
  editCompanyError: string = '';

  uploadedFiles: DisplayFile[] = [];
  existingImageUrls: string[] = [];
  imagesToDelete: string[] = [];
  isDragging: boolean = false;

  companyForm: FormGroup;

  editCompanyName: string = '';
  editAddress: string = '';
  editCity: string = '';
  editDescription: string = ''

  constructor(private barberService: BarberService, private authService: AuthService,
    private router: Router, private toastr: ToastrService
  ) {
    this.companyForm = new FormGroup({
      companyName: new FormControl('', Validators.required),
      /* address: new FormControl(''),
      city: new FormControl(''),
      description: new FormControl('') */
      // Slike se ne vezuju direktno za FormControl jer su kompleksne
    });
  }


  ngOnInit(): void {

    if (!this.authService.isAdmin()) {
      this.router.navigate(['/companies']);
      return;
    }

    this.loadCompanies();
  }


  loadCompanies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.barberService.getAllCompanies().subscribe({
      next: (data: CompanyConfigModel[]) => {
        this.companies = data
        this.isLoading = false;
        console.log('Companies loaded:', this.companies);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Došlo je do greške prilikom učitavanja kompanija.';
        this.isLoading = false;
        //this.toastr.error(error.error.message);
        console.error('Error loading companies:', error);
      }
    });
  }



  deleteCompany(companyId: string): void {
    showConfirm('Da li ste sigurni da želite da obrišete ovu kompaniju?', () => {
      this.barberService.deleteCompany(companyId).subscribe({
        next: () => {
          showSuccess('Kompanija uspešno obrisana.');
          this.companies = this.companies.filter(c => c.companyId !== companyId);
          if (this.selectedCompanyForEdit?.companyId === companyId) {
            this.cancelEdit();
          }
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Došlo je do greške prilikom brisanja kompanije.';
          if (error.status === 404) {
            errorMessage = error.error || 'Kompanija nije pronađena.';
          } else if (error.status === 400) {
            errorMessage = error.error || 'Neispravan zahtev.';
          } else if (error.status === 500) {
            errorMessage = error.error || 'Server je naišao na internu grešku.';
          } else {
            errorMessage = `Došlo je do nepoznate greške (Status: ${error.status})`;
          }
          showError(errorMessage);
          console.error('Error deleting company:', error.error.message);
        }
      });
    })
  }





  editCompany(companyId: string): void {
    this.selectedCompanyForEdit = null;
    this.isEditing = false;
    this.isLoadingCompanyForEdit = true;
    this.editCompanyError = '';

    this.uploadedFiles = [];
    this.existingImageUrls = [];
    this.imagesToDelete = [];


    this.barberService.getCompanyDetailsById(companyId).subscribe({
      next: (company: CompanyConfigModel) => {
        this.selectedCompanyForEdit = company;
        this.isEditing = true;
        this.isLoadingCompanyForEdit = false;

        this.companyForm.patchValue({
          companyName: company.companyName,
          /* address: company.address || '',
          city: company.city || '',
          description: company.description || '' */
        });

        this.existingImageUrls = [...company.imageUrl];


        setTimeout(() => {
          const editFormElement = document.getElementById('editCompanyForm');
          if (editFormElement) {
            editFormElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);

      },
      error: (err) => {
        this.editCompanyError = 'Nije moguće učitati detalje kompanije za izmenu.';
        this.isLoadingCompanyForEdit = false;
        console.error('Error loading company for edit:', err);
        showError(this.editCompanyError);
      }
    });
  }



  onSubmitEdit(): void {
    if (!this.selectedCompanyForEdit) {
      showError('Nema odabrane kompanije za izmenu.');
      return;
    }

    if (this.companyForm.invalid) {
      showError('Molimo popunite sva obavezna polja.');
      this.companyForm.markAllAsTouched();
      return;
    }

    if (this.existingImageUrls.length === 0 && this.uploadedFiles.length === 0) {
      showError('Kompanija mora imati barem jednu sliku.');
      return;
    }

    const formData = new FormData();
    formData.append('UpdateCompanyDto.CompanyId', this.selectedCompanyForEdit.companyId);
    formData.append('UpdateCompanyDto.CompanyName', this.companyForm.get('companyName')?.value || '');
    /* formData.append('address', this.companyForm.get('address')?.value || '');
    formData.append('city', this.companyForm.get('city')?.value || '');
    formData.append('description', this.companyForm.get('description')?.value || ''); */

    this.uploadedFiles.forEach(displayFile => {
      formData.append('UpdateCompanyDto.NewImages', displayFile.file, displayFile.name);
    });

    this.imagesToDelete.forEach(imageUrl => {
      formData.append('UpdateCompanyDto.ImagesToDelete', imageUrl);
    });

    console.log('Submitting form data:', ...formData.entries());
    
    showConfirm('Da li ste sigurni da želite da sačuvate izmene?', () => {
      this.barberService.updateCompany(formData).subscribe({
        next: () => {
          showSuccess('Kompanija uspešno izmenjena!');
          this.loadCompanies();
          this.cancelEdit();
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Došlo je do greške prilikom izmene kompanije.';
          if (error.error?.message) {
            errorMessage += ' ' + error.error.message;
          } else if (error.statusText) {
            errorMessage += ' ' + error.statusText;
          }
          showError(errorMessage);
          console.error('Error updating company:', error);
        }
      });
    });
  }


  cancelEdit(): void {
    this.isEditing = false;
    this.selectedCompanyForEdit = null;
    this.editCompanyError = '';
    this.uploadedFiles = [];
    this.existingImageUrls = [];
    this.imagesToDelete = [];
    this.companyForm.reset();
  }






  // --- LOGIKA ZA DRAG-AND-DROP I ODABIR FAJLOVA ---
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
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(input.files);
    }
    event.target.value = '';
  }

  private processFiles(fileList: FileList): void {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.startsWith('image/')) {
        showError('Dozvoljeni su samo fajlovi slika.');
        continue;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
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


  removeExistingImage(imageUrl: string): void {
    this.imagesToDelete.push(imageUrl);
    this.existingImageUrls = this.existingImageUrls.filter(url => url !== imageUrl);
  }

  removeUploadedFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  viewCompanyDetails(companyId: string): void {
    this.router.navigate(['/companies', companyId]);
  }


}
