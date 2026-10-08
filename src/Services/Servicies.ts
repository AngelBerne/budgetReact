import { settings } from "../api";

import { Transaction } from "../Models/DataTransactions";

type TKEY_SERVICES =
  | "transactions"
  | "CATEGORIES"
  | "Date"
  | "SUBCATEGORIES"
  | "summary";

export const KEY_SERVICES: { [key: string]: TKEY_SERVICES } = {
  TRANSACIONS: "transactions",
  CATEGORIES: "CATEGORIES",
  SUBCATEGORIES: "SUBCATEGORIES",
  SUMMARY: "summary",
  DATE: "Date",
};

export interface IServiciesDB {
  getSheetData(): Promise<Transaction[]>;
  sendSheetDataTransaction(data: Transaction[]): Promise<boolean>;

  handleBackup(data: Transaction[]): Promise<void>;
  handleUpdate(data: Transaction[]): Promise<boolean>;
  handleDeleteOne(data: Transaction[]): Promise<boolean>;
  handleDelete(): Promise<boolean>;
}

export class ServiciesLocalTransactions implements IServiciesDB {
  constructor() {}

  handleUpdate(data: Transaction[]): Promise<boolean> {
    localStorage.setItem(KEY_SERVICES.TRANSACIONS, JSON.stringify(data));
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  handleDeleteOne(data: Transaction[]): Promise<boolean> {
    localStorage.setItem(KEY_SERVICES.TRANSACIONS, JSON.stringify(data));
    return new Promise((resolve) => {
      resolve(true);
    });
  }
  handleDelete(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(true);
    });
    return new Promise((resolve) => {
      localStorage.removeItem(KEY_SERVICES.TRANSACIONS);
      resolve(true);
    });
  }

  getSheetData(): Promise<Transaction[]> {
    return new Promise((resolve) => {
      const data = JSON.parse(
        localStorage.getItem(KEY_SERVICES.TRANSACIONS) || "[]",
      );
      resolve(data.map((f: any) => new Transaction(f)));
    });
  }
  async sendSheetDataTransaction(data: Transaction[]): Promise<boolean> {
    return new Promise((resolve) => {
      localStorage.setItem(KEY_SERVICES.TRANSACIONS, JSON.stringify(data));
      resolve(true);
    });
  }

  handleBackup(data: Transaction[]): Promise<void> {
    localStorage.setItem(KEY_SERVICES.TRANSACIONS, JSON.stringify(data));
    const db = new GoogleSheetsServiciesTransactions();
    db.handleBackup(data);
    return new Promise((resolve) => {
      resolve();
    });
  }
}

export class SummaryData {
  static async saveData(data: any) {
    if (!data) return;
    delete data.databyCatefory;
    delete data.monthlyBank;
    delete data.monthlyCrypto;
    delete data.monthlyMortgage;
    delete data.monthlyStocks;
    delete data.totalCheckingAccount;
    delete data.totalExpenses;
    delete data.totalIncome;

    const myDate =
      new Date().getDate() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getFullYear();

    const myTime =
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds();

    const data2 = [
      {
        id: "summary" + new Date().getTime(),
        totalBalance: data.totalBalance,
        totalCash: data.totalCash,
        totalCardRed: data.totalCardRed,
        totalCardBlue: data.totalCardBlue,
        savingsMortgage: data.savingsMortgage,
        savingsBank: data.savingsBank,
        savingsStocks: data.savingsStocks,
        savingsCrypto: data.savingsCrypto,
        date: myDate + " " + myTime,
      },
    ];

    const payload = {
      sheetName: KEY_SERVICES.SUMMARY,
      data: data2,
    };

    await fetch(settings.url, {
      method: "POST",

      body: JSON.stringify(payload),
    });
  }
}

export class GoogleSheetsServiciesTransactions implements IServiciesDB {
  constructor() {}
  handleUpdate(data: Transaction[]): Promise<boolean> {
    this.handleBackup(data);
    return new Promise((resolve) => {
      resolve(true);
    });
  }
  async handleBackup(data?: Transaction[]): Promise<void> {
    if (!data) return;
    const payload = {
      sheetName: KEY_SERVICES.TRANSACIONS,
      data: data.map((t) => t.toSheetRow()), // 👈 clave aquí
    };

    const response = await fetch(settings.url, {
      method: "POST",

      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Failed to sync transactions");
    }

    const result = await response.json();
    return new Promise((resolve) => {
      resolve(result);
    });
  }
  handleDelete(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(false);
    });
  }
  handleDeleteOne(data: Transaction[]): Promise<boolean> {
    this.handleBackup(data);

    return new Promise((resolve) => {
      resolve(true);
    });
  }

  async getSheetData() {
    try {
      const url = `${settings.url}?sheetName=${encodeURIComponent(
        KEY_SERVICES.TRANSACIONS,
      )}`;
      const response = await fetch(url);

      // if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const dataToReturn = data.map((item: any) => new Transaction(item));

      return dataToReturn;
    } catch (error) {
      return [];
      console.error("Fetch error:", error);
    }
  }
  async sendSheetDataTransaction(data: Transaction[]) {
    this.handleBackup(data);
    return true;
  }
}
