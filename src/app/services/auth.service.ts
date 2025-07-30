import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { UserAppointment } from "../models/user-appointment.config";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authUrl = 'http://localhost:5045/auth';
    private roleKey = 'user_role';
    private user_email = 'user_email';
    private user_id = 'user_id';
    private user_firstName = 'user_firstName';
    private user_lastName = 'user_lastName';
    private user_phoneNumber = 'user_phoneNumber';
    private owner_company_id = 'owner_company_id';
    private barber_id = 'barber_id';
    private loggedIn = new BehaviorSubject<boolean>(this.checkStorage())
    isLoggedin$ = this.loggedIn.asObservable()

    constructor(private http: HttpClient) { }
    private checkStorage(): boolean {
        return !!localStorage.getItem("user_role")

    }
    login(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.authUrl}/login`, formData).pipe(
            tap(response => {
                if (response && response.role) {
                    localStorage.setItem(this.roleKey, response.role);
                    localStorage.setItem(this.user_email, response.email);
                    localStorage.setItem(this.user_id, response.userId);
                    localStorage.setItem(this.user_firstName, response.firstName);
                    localStorage.setItem(this.user_lastName, response.lastName);
                    localStorage.setItem(this.user_phoneNumber, response.phoneNumber);
                    if (response.barberId) {
                        localStorage.setItem(this.barber_id, response.barberId);
                    }
                    this.loggedIn.next(true)
                }
            })
        );

    }
    createCompanyOwner(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.authUrl}/createCompanyOwner`, formData)
    }

    register(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.authUrl}/register`, formData)
    }

    checkIfCompanyOwnerExists(id: string): Observable<any> {
        return this.http.get<any>(`${this.authUrl}/checkIfCompanyOwnerExists?CompanyId=${id}`)
    }

    getOwners(): Observable<any[]> {
        return this.http.get<any[]>(`${this.authUrl}/get-owners`)
    }

    assignCompanyOwnerToCompany(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.authUrl}/assign-company-owner`, formData)
    }

    getCompaniesByOwnerEmail(email: string): Observable<any[]>{
        return this.http.get<any[]>(`${this.authUrl}/get-companies-by-owner-email?Email=${email}`);
    }

    

    /*  */
    getOwnerDetailsById(ownerId: string): Observable<any> {
        return this.http.get<any>(`${this.authUrl}/get-owner-details?OwnerId=${ownerId}`);
    }
    updateOwnerDetails(formData: FormData): Observable<string> {
        return this.http.put(`${this.authUrl}/update-owner`, formData, { responseType: 'text' as const });
    }
    deleteOwner(ownerId: string): Observable<string> {
        return this.http.delete(`${this.authUrl}/delete-owner?OwnerId=${ownerId}`, { responseType: 'text' as const });
    }
    /*  */


    /* user api */
    getAllAppointmentsByUserId(userId: string): Observable<UserAppointment[]>{
        return this.http.get<UserAppointment[]>(`${this.authUrl}/get-appointments-by-user-id?UserId=${userId}`)
    }




    logout(): void {
        //localStorage.removeItem(this.roleKey);
        localStorage.clear();
        this.loggedIn.next(false)
    }

    getRole(): string | null {
        return localStorage.getItem(this.roleKey);
    }
    
    getEmail(): string {
        return localStorage.getItem(this.user_email) ?? '';
    }
    getUserId(): string {
        return localStorage.getItem(this.user_id) ?? '';
    }
    getFirstName(): string {
        return localStorage.getItem(this.user_firstName) ?? '';
    }
    getLastName(): string {
        return localStorage.getItem(this.user_lastName) ?? '';
    }
    getPhoneNumber(): string {
        return localStorage.getItem(this.user_phoneNumber) ?? '';
    }
    getBarberId(): string {
        return localStorage.getItem(this.barber_id) ?? '';
    }

    isAdmin(): boolean {
        return this.getRole() === 'Admin';
    }

    isOwner(): boolean {
        return this.getRole() === 'CompanyOwner';
    }

    isBarber(): boolean {
        return this.getRole() === 'Barber';
    }

    isRegisteredUser(): boolean {
        return this.getRole() === 'RegisteredUser';
    }

    setOwnerCompanyId(ids: any[]) {
        localStorage.setItem(this.owner_company_id, JSON.stringify(ids));
    }
    getOwnerCompanyIds(): string | null {
        return localStorage.getItem(this.owner_company_id);
    }

    isLoggedIn(): boolean {
        return this.getRole() !== null;
    }

}