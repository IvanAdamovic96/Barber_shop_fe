import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authUrl = 'http://localhost:5045/auth';
    private roleKey = 'user_role';
    private owner_company_id = 'owner_company_id';
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

    logout(): void {
        //localStorage.removeItem(this.roleKey);
        localStorage.clear();
        this.loggedIn.next(false)
    }

    getRole(): string | null {
        return localStorage.getItem(this.roleKey);
    }

    isAdmin(): boolean {
        return this.getRole() === 'Admin';
    }

    isOwner(): boolean {
        return this.getRole() === 'CompanyOwner';
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