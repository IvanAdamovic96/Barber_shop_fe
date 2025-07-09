import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authUrl = 'http://localhost:5045/auth';
    private roleKey = 'user_role';
    private loggedIn = new BehaviorSubject<boolean>(this.checkStorage())
    isLoggedin$ =this.loggedIn.asObservable()

    constructor(private http: HttpClient) { }
    private checkStorage(): boolean{
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
    createCompanyOwner(formData: FormData):Observable<any>{
        return this.http.post<any>(`${this.authUrl}/createCompanyOwner`, formData)
    }

    register(formData : FormData):Observable<any>{
        return this.http.post<any>(`${this.authUrl}/register`, formData)
    }


    logout(): void {
        localStorage.removeItem(this.roleKey);
        this.loggedIn.next(false)
    }

    getRole(): string | null {
        return localStorage.getItem(this.roleKey);
    }

    isAdmin(): boolean {
        return this.getRole() === 'Admin';
    }

    isLoggedIn(): boolean {
        return this.getRole() !== null;
    }

}