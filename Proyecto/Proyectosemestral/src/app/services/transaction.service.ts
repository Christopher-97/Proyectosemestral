import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable, map, switchMap, of } from 'rxjs';
import { ApiService, Transaction as ApiTransaction } from './api.service';
import { AuthService } from './auth.service';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();
  private readonly STORAGE_KEY = 'transactions';

  constructor(
    private storage: Storage,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.init();
  }

  async init() {
    await this.storage.create();
    // Intentar cargar desde API primero, luego fallback a storage local
    this.loadTransactions();
  }

  private async loadTransactions() {
    try {
      const currentUser = this.authService.getCurrentUser();
      const apiTransactions = await this.apiService.getTransactions(currentUser?.id).toPromise();

      if (apiTransactions && apiTransactions.length > 0) {
        // Convertir formato API a formato local
        const localTransactions: Transaction[] = apiTransactions.map(apiTrans => ({
          id: apiTrans.id?.toString() || Date.now().toString(),
          type: apiTrans.type,
          amount: apiTrans.amount,
          category: apiTrans.category,
          description: apiTrans.description,
          date: new Date(apiTrans.date),
          currency: apiTrans.currency
        }));

        this.transactionsSubject.next(localTransactions);
        // Sincronizar con storage local
        await this.storage.set(this.STORAGE_KEY, localTransactions);
      } else {
        // Fallback a storage local
        const localTransactions = await this.storage.get(this.STORAGE_KEY) || [];
        this.transactionsSubject.next(localTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions from API:', error);
      // Fallback a storage local
      const localTransactions = await this.storage.get(this.STORAGE_KEY) || [];
      this.transactionsSubject.next(localTransactions);
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      const apiTransaction: ApiTransaction = {
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date.toISOString(),
        currency: transaction.currency,
        user_id: currentUser?.id
      };

      // Agregar a API
      const addedTransaction = await this.apiService.addTransaction(apiTransaction).toPromise();

      // Agregar localmente
      const newTransaction: Transaction = {
        id: addedTransaction?.id?.toString() || Date.now().toString(),
        ...transaction
      };

      const currentTransactions = this.transactionsSubject.value;
      const updatedTransactions = [...currentTransactions, newTransaction];

      this.transactionsSubject.next(updatedTransactions);
      await this.storage.set(this.STORAGE_KEY, updatedTransactions);
    } catch (error) {
      console.error('Error adding transaction to API:', error);
      // Fallback: agregar solo localmente
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString()
      };

      const currentTransactions = this.transactionsSubject.value;
      const updatedTransactions = [...currentTransactions, newTransaction];

      this.transactionsSubject.next(updatedTransactions);
      await this.storage.set(this.STORAGE_KEY, updatedTransactions);
    }
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
    try {
      // Actualizar en API
      const apiUpdates: Partial<ApiTransaction> = {};
      if (updates.type) apiUpdates.type = updates.type;
      if (updates.amount !== undefined) apiUpdates.amount = updates.amount;
      if (updates.category) apiUpdates.category = updates.category;
      if (updates.description) apiUpdates.description = updates.description;
      if (updates.date) apiUpdates.date = updates.date.toISOString();
      if (updates.currency) apiUpdates.currency = updates.currency;

      await this.apiService.updateTransaction(id, apiUpdates).toPromise();

      // Actualizar localmente
      const currentTransactions = this.transactionsSubject.value;
      const updatedTransactions = currentTransactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      );

      this.transactionsSubject.next(updatedTransactions);
      await this.storage.set(this.STORAGE_KEY, updatedTransactions);
    } catch (error) {
      console.error('Error updating transaction in API:', error);
      // Fallback: actualizar solo localmente
      const currentTransactions = this.transactionsSubject.value;
      const updatedTransactions = currentTransactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      );

      this.transactionsSubject.next(updatedTransactions);
      await this.storage.set(this.STORAGE_KEY, updatedTransactions);
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      // Eliminar de API
      await this.apiService.deleteTransaction(id).toPromise();

      // Eliminar localmente
      const currentTransactions = this.transactionsSubject.value;
      const updatedTransactions = currentTransactions.filter(t => t.id !== id);

      this.transactionsSubject.next(updatedTransactions);
      await this.storage.set(this.STORAGE_KEY, updatedTransactions);
    } catch (error) {
      console.error('Error deleting transaction from API:', error);
      // Fallback: eliminar solo localmente
      const currentTransactions = this.transactionsSubject.value;
      const updatedTransactions = currentTransactions.filter(t => t.id !== id);

      this.transactionsSubject.next(updatedTransactions);
      await this.storage.set(this.STORAGE_KEY, updatedTransactions);
    }
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$;
  }

  getTransactionsByType(type: 'income' | 'expense'): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => transactions.filter(t => t.type === type))
    );
  }

  getTotalByType(type: 'income' | 'expense'): Observable<number> {
    return this.transactions$.pipe(
      map(transactions => {
        return transactions
          .filter(t => t.type === type)
          .reduce((sum, t) => sum + t.amount, 0);
      })
    );
  }

  getBalance(): Observable<number> {
    return this.transactions$.pipe(
      map(transactions => {
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return income - expenses;
      })
    );
  }

  getTransactionsByCategory(): Observable<{ [category: string]: number }> {
    return this.transactions$.pipe(
      map(transactions => {
        const categoryTotals: { [category: string]: number } = {};
        transactions.forEach(t => {
          if (!categoryTotals[t.category]) {
            categoryTotals[t.category] = 0;
          }
          categoryTotals[t.category] += t.amount;
        });
        return categoryTotals;
      })
    );
  }

  // Método para sincronizar datos locales con API
  async syncWithAPI(): Promise<void> {
    await this.loadTransactions();
  }
}
