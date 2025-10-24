import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id?: number;
  email: string;
  password: string;
  created_at?: string;
}

export interface Session {
  id?: number;
  user_id: number;
  active: boolean;
  last_login: string | null;
}

export interface Category {
  id?: number;
  name: string;
  budget_limit: number;
  color: string;
}

export interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
  user_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database!: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.createDatabase();
    });
  }

  private async createDatabase() {
    try {
      this.database = await this.sqlite.create({
        name: 'finanzas.db',
        location: 'default'
      });

      await this.createTables();
      await this.insertDefaultData();
      this.dbReady.next(true);
    } catch (error) {
      console.error('Error creating database:', error);
    }
  }

  private async createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        active BOOLEAN DEFAULT 0,
        last_login DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,
      `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        budget_limit REAL DEFAULT 0,
        color TEXT DEFAULT '#2196F3'
      )`,
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date DATETIME NOT NULL,
        currency TEXT DEFAULT 'COP',
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,
      `CREATE TABLE IF NOT EXISTS exchange_rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_currency TEXT NOT NULL,
        to_currency TEXT NOT NULL,
        rate REAL NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const table of tables) {
      await this.database.executeSql(table, []);
    }
  }

  private async insertDefaultData() {
    // Insert default categories
    const defaultCategories = [
      ['Salario', 0, '#4CAF50'],
      ['Alimentación', 2000, '#FF9800'],
      ['Transporte', 1000, '#2196F3'],
      ['Entretenimiento', 500, '#9C27B0'],
      ['Servicios', 1500, '#FF5722'],
      ['Freelance', 0, '#00BCD4']
    ];

    for (const category of defaultCategories) {
      await this.database.executeSql(
        'INSERT OR IGNORE INTO categories (name, budget_limit, color) VALUES (?, ?, ?)',
        category
      );
    }

    // Insert default user
    await this.database.executeSql(
      'INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)',
      ['admin@finanzas.com', '123456']
    );

    // Insert sample transactions
    const sampleTransactions = [
      ['income', 5000, 'Salario', 'Salario mensual', '2024-01-01', 'COP'],
      ['expense', 1500, 'Alimentación', 'Compra supermercado', '2024-01-02', 'COP'],
      ['expense', 800, 'Transporte', 'Gasolina', '2024-01-03', 'COP'],
      ['income', 2000, 'Freelance', 'Proyecto web', '2024-01-04', 'COP']
    ];

    for (const transaction of sampleTransactions) {
      await this.database.executeSql(
        'INSERT OR IGNORE INTO transactions (type, amount, category, description, date, currency) VALUES (?, ?, ?, ?, ?, ?)',
        transaction
      );
    }
  }

  // User methods
  async createUser(user: User): Promise<number> {
    const result = await this.database.executeSql(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [user.email, user.password]
    );
    return result.insertId || 0;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.database.executeSql(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const result = await this.database.executeSql(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  }

  // Session methods
  async createSession(userId: number): Promise<void> {
    // Close any existing active sessions
    await this.database.executeSql(
      'UPDATE sessions SET active = 0 WHERE active = 1',
      []
    );

    // Create new session
    await this.database.executeSql(
      'INSERT INTO sessions (user_id, active, last_login) VALUES (?, 1, datetime("now"))',
      [userId]
    );
  }

  async closeSession(userId: number): Promise<void> {
    await this.database.executeSql(
      'UPDATE sessions SET active = 0 WHERE user_id = ? AND active = 1',
      [userId]
    );
  }

  async getActiveSession(): Promise<Session | null> {
    const result = await this.database.executeSql(
      'SELECT * FROM sessions WHERE active = 1 LIMIT 1',
      []
    );

    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  }

  // Transaction methods
  async addTransaction(transaction: Transaction): Promise<number> {
    const result = await this.database.executeSql(
      'INSERT INTO transactions (type, amount, category, description, date, currency, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [transaction.type, transaction.amount, transaction.category, transaction.description, transaction.date, transaction.currency, transaction.user_id || 1]
    );
    return result.insertId || 0;
  }

  async getTransactions(userId?: number): Promise<Transaction[]> {
    const query = userId
      ? 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC'
      : 'SELECT * FROM transactions ORDER BY date DESC';

    const params = userId ? [userId] : [];
    const result = await this.database.executeSql(query, params);

    const transactions: Transaction[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      transactions.push(result.rows.item(i));
    }
    return transactions;
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<void> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await this.database.executeSql(
      `UPDATE transactions SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.database.executeSql(
      'DELETE FROM transactions WHERE id = ?',
      [id]
    );
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    const result = await this.database.executeSql('SELECT * FROM categories', []);
    const categories: Category[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      categories.push(result.rows.item(i));
    }
    return categories;
  }

  // Utility methods
  getDatabaseState(): Observable<boolean> {
    return this.dbReady.asObservable();
  }

  async isDatabaseReady(): Promise<boolean> {
    return this.dbReady.value;
  }
}
