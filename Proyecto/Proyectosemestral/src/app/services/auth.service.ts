import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ApiService, User } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private storage: Storage,
    private router: Router,
    private apiService: ApiService
  ) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const user = await this.storage.get('currentUser');
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.apiService.login(email, password).toPromise();
      if (user) {
        // Agregar token simulado
        const userWithToken = {
          ...user,
          token: 'jwt-token-' + Date.now()
        };

        await this.storage.set('currentUser', userWithToken);
        this.currentUserSubject.next(userWithToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async register(email: string, password: string): Promise<boolean> {
    try {
      const newUser: User = {
        email,
        password
      };
      const user = await this.apiService.register(newUser).toPromise();
      if (user) {
        const userWithToken = {
          ...user,
          token: 'jwt-token-' + Date.now()
        };

        await this.storage.set('currentUser', userWithToken);
        this.currentUserSubject.next(userWithToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  }

  async logout() {
    await this.storage.remove('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
