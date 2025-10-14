import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const transactions = await this.storage.get(this.STORAGE_KEY) || [];
    this.transactionsSubject.next(transactions);
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<void> {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };

    const currentTransactions = this.transactionsSubject.value;
    const updatedTransactions = [...currentTransactions, newTransaction];

    await this.storage.set(this.STORAGE_KEY, updatedTransactions);
    this.transactionsSubject.next(updatedTransactions);
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
    const currentTransactions = this.transactionsSubject.value;
    const updatedTransactions = currentTransactions.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );

    await this.storage.set(this.STORAGE_KEY, updatedTransactions);
    this.transactionsSubject.next(updatedTransactions);
  }

  async deleteTransaction(id: string): Promise<void> {
    const currentTransactions = this.transactionsSubject.value;
    const updatedTransactions = currentTransactions.filter(t => t.id !== id);

    await this.storage.set(this.STORAGE_KEY, updatedTransactions);
    this.transactionsSubject.next(updatedTransactions);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$;
  }

  getTransactionsByType(type: 'income' | 'expense'): Observable<Transaction[]> {
    return new Observable(observer => {
      this.transactions$.subscribe(transactions => {
        observer.next(transactions.filter(t => t.type === type));
      });
    });
  }

  getTotalByType(type: 'income' | 'expense'): Observable<number> {
    return new Observable(observer => {
      this.transactions$.subscribe(transactions => {
        const total = transactions
          .filter(t => t.type === type)
          .reduce((sum, t) => sum + t.amount, 0);
        observer.next(total);
      });
    });
  }

  getBalance(): Observable<number> {
    return new Observable(observer => {
      this.transactions$.subscribe(transactions => {
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        observer.next(income - expenses);
      });
    });
  }

  getTransactionsByCategory(): Observable<{ [category: string]: number }> {
    return new Observable(observer => {
      this.transactions$.subscribe(transactions => {
        const categoryTotals: { [category: string]: number } = {};
        transactions.forEach(t => {
          if (!categoryTotals[t.category]) {
            categoryTotals[t.category] = 0;
          }
          categoryTotals[t.category] += t.amount;
        });
        observer.next(categoryTotals);
      });
    });
  }
}
