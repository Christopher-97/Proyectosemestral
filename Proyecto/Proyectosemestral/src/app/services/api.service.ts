import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
  id?: number;
  email: string;
  password: string;
  created_at?: string;
}

export interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
  user_id?: number;
}

export interface Category {
  id?: number;
  name: string;
  budget_limit: number;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // URL del json-server

  constructor(private http: HttpClient) {}

  // Métodos para Usuarios
  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}&password=${password}`).pipe(
      map(users => users.length > 0 ? users[0] : null),
      catchError(this.handleError)
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Métodos para Transacciones
  getTransactions(userId?: number): Observable<Transaction[]> {
    const url = userId ? `${this.baseUrl}/transactions?user_id=${userId}` : `${this.baseUrl}/transactions`;
    return this.http.get<Transaction[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions`, transaction).pipe(
      catchError(this.handleError)
    );
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.baseUrl}/transactions/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/transactions/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Métodos para Categorías
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`).pipe(
      catchError(this.handleError)
    );
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener balance
  getBalance(userId?: number): Observable<number> {
    return this.getTransactions(userId).pipe(
      map(transactions => {
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return income - expenses;
      }),
      catchError(this.handleError)
    );
  }

  // Método para obtener totales por categoría
  getCategoryTotals(userId?: number): Observable<{ [category: string]: number }> {
    return this.getTransactions(userId).pipe(
      map(transactions => {
        const categoryTotals: { [category: string]: number } = {};
        transactions.forEach(t => {
          if (!categoryTotals[t.category]) {
            categoryTotals[t.category] = 0;
          }
          categoryTotals[t.category] += t.amount;
        });
        return categoryTotals;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('Error en la comunicación con el servidor'));
  }
}
