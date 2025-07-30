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

  getCompanyDetailsById(id: string): Observable<any> {
    return this.http.get<any>(`${this.companyUrl}/getCompanyDetailsById?CompanyId=${id}`);
  }

  createHaircut(formData: FormData): Observable<string> {
    return this.http.post(`${this.companyUrl}/create-haircut`, formData, { responseType: 'text' as const });
  }

  /* Haircuts */
  getAllHaircutsByCompanyId(id: string): Observable<any> {
    return this.http.get<any>(`${this.companyUrl}/get-all-haircuts-by-companyid?CompanyId=${id}`);
  }

  getHaircutDetailsById(id: string): Observable<any> {
    return this.http.get<any>(`${this.companyUrl}/get-haircut-details-by-id?HaircutId=${id}`);
  }

  updateHaircutDetails(formData: FormData): Observable<string> {
    return this.http.put(`${this.companyUrl}/update-haircut`, formData, { responseType: 'text' as const });
  }

  deleteHaircut(haircutId: string): Observable<string> {
    return this.http.delete(`${this.companyUrl}/delete-haircut?HaircutId=${haircutId}`, { responseType: 'text' as const });
  }
  /* ----- */


  createBarber(formData: any): Observable<any> {
    return this.http.post<any>(`${this.barberUrl}/create`, formData)
  }

  getAllFreeAppointmentsByBarberId(selectedDate: Date, barberId: string): Observable<any> {
    selectedDate.setHours(12, 0, 0, 0);
    const isoString = selectedDate.toISOString();
    const encodedDate = encodeURIComponent(isoString);
    return this.http.get<any>(`${this.scheduleUrl}/GetAllFreeAppointments?selectedDate=${encodedDate}&barberId=${barberId}`)
  }

  getAllUsedAppointmentsByBarberId(barberId: string): Observable<any> {
    return this.http.get<any>(`${this.scheduleUrl}/GetAllUsedAppointments?BarberId=${barberId}`)
  }

  deleteAppointment(appointmentId: string): Observable<string> {
    return this.http.delete(`${this.scheduleUrl}/delete-appointment?AppointmentId=${appointmentId}`, { responseType: 'text' as const });
  }

  getBarberDetailsByBarberId(barberId: string): Observable<any> {
    return this.http.get<any>(`${this.barberUrl}/get-barber-details-by-barber-id?BarberId=${barberId}`);
  }

  updateBarberDetails(formData: FormData): Observable<string> {
    return this.http.put(`${this.barberUrl}/update-barber-details`, formData, { responseType: 'text' as const });
  }

  deleteBarber(barberId: string): Observable<string> {
    return this.http.delete(`${this.barberUrl}/delete-barber?BarberId=${barberId}`, { responseType: 'text' as const });
  }

  createSchedule(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.scheduleUrl}/CreateAppointment`, formData)
  }

  deleteCompany(companyId: string): Observable<string> {
    return this.http.delete(`${this.companyUrl}/delete-company?CompanyId=${companyId}`, { responseType: 'text' as const });
  }

  updateCompany(formData: FormData): Observable<string> {
    return this.http.put(`${this.companyUrl}/update-company`, formData, { responseType: 'text' as const });
  }

}
