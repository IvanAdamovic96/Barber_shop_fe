import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BarberService {
  private baseUrl = 'http://localhost:5045/company';
  private baseUrl2='http://localhost:5045/barber';
  constructor(private http:HttpClient) { }

  getAllCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAllCompanies`);
  }

  getAllBarbersByCompanyId(id: string): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl2}/getAllBarbersByCompanyId?companyId=${id}`);
  }

  createCompany(companyName: string, image: File): Observable<any> {
  const formData = new FormData();
  formData.append('CompanyName', companyName);
  formData.append('Image', image);

  return this.http.post<any>(`${this.baseUrl}/create-company`, formData);
}

  
}



/* private baseUrl = 'http://localhost:5045/company'; // 👈 ispravno bez "/api"

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAllCompanies`); */