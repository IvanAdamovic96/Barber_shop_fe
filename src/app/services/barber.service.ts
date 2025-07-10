import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyConfigModel } from '../models/company.config';



@Injectable({
  providedIn: 'root'
})

export class BarberService {
  private companyUrl = 'http://localhost:5045/company';
  private barberUrl = 'http://localhost:5045/barber';
  private scheduleUrl = 'http://localhost:5045/schedule';
  
  constructor(private http: HttpClient) { }

  getAllCompanies(): Observable<CompanyConfigModel[]> {
    return this.http.get<CompanyConfigModel[]>(`${this.companyUrl}/getAllCompanies`);
  }

  getAllBarbersByCompanyId(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.barberUrl}/getAllBarbersByCompanyId?companyId=${id}`);
  }

  createCompany(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.companyUrl}/create-company`, formData);
  }

  getCompanyDetailsById(id:string):Observable<any>{
    return this.http.get<any>(`${this.companyUrl}/getCompanyDetailsById?CompanyId=${id}`);
  }

  createHaircut(formData: FormData):Observable<any>{
    return this.http.post<any>(`${this.companyUrl}/create-haircut`, formData);
  }

  getAllHaircutsByCompanyId(id:string):Observable<any>{
    return this.http.get<any>(`${this.companyUrl}/get-all-haircuts-by-companyid?CompanyId=${id}`);
  }
  
  createBarber(formData: any): Observable<any> {
    return this.http.post<any>(`${this.barberUrl}/create`, formData)
  }

  getAllFreeAppointmentsByBarberId(selectedDate: Date, barberId: string): Observable<any> {
    selectedDate.setHours(12, 0, 0, 0);
    const isoString = selectedDate.toISOString();
    // Encode za URL
    const encodedDate = encodeURIComponent(isoString);
    return this.http.get<any>(`${this.scheduleUrl}/GetAllFreeAppointments?selectedDate=${encodedDate}&barberId=${barberId}`)
  }

  createSchedule(formData: FormData):Observable<any>{
    return this.http.post<any>(`${this.scheduleUrl}/CreateAppointment`, formData)
  }


}



/* private baseUrl = 'http://localhost:5045/company'; // 👈 ispravno bez "/api"

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAllCompanies`); */