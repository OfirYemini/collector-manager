import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api'

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {
  createDb(reqInfo?: RequestInfo): {} | import("rxjs").Observable<{}> | Promise<{}> {
    let users = [
      { id: 1, firstName: 'משה', lastName: 'זהבי' },
      { id: 2, firstName: 'שלמה', lastName: 'ימיני' },
      { id: 3, firstName: 'אריאל המשתכנז', lastName: 'ימיני' },
      { id: 4, firstName: 'יהודה', lastName: 'דר' }
    ];

    var now = Date.now();
    let transactions = [
      { id: 1, prayerName: 'משה זהבי', description: 'שביעי', amount: 50, date: new Date(2019, 8, 1).toLocaleDateString() },
      { id: 2, prayerName: 'שלמה ימיני', description: 'חמישי', amount: 55, date: new Date(2019, 8, 2).toLocaleDateString() },
      { id: 3, prayerName: 'שלמה ימיני', description: 'מוסף', amount: 40, date: new Date(2019, 8, 1).toLocaleDateString() },
      { id: 4, prayerName: 'יהודה דאר', description: 'שביעי', amount: 30, date: new Date(2019, 8, 2).toLocaleDateString() },
    ];

    let hebrewCalendar = [{ ts: 1568190861684, hebrewDate:{
      year:'תשע"ט',
      month:'ניסן',
      day:'יד',
      festival:'פסח'
    }}];
    

    let reports = [
      {
        userId: 1, payload: {
          fullName: 'משה זהבי',
          transactions: [
            { description: 'העברת יתרה', amount: 20, date: new Date(2019, 7, 1).toLocaleDateString(), hebrewDate: 'א תשרי' },
            { description: 'שביעי', amount: -50, date: new Date(2019, 7, 1).toLocaleDateString(), hebrewDate: 'א תשרי' },
            { description: 'מוסף', amount: -50, date: new Date(2019, 8, 8).toLocaleDateString(), hebrewDate: 'ד חוה"מ סוכות' },
            { description: 'ראשון', amount: -20, date: new Date(2019, 8, 18).toLocaleDateString(), hebrewDate: 'שמחת תורה' },
            { description: 'מפטיר', amount: -55, date: new Date(2019, 9, 1).toLocaleDateString(), hebrewDate: 'נח' },
            { description: 'מנחה', amount: -70, date: new Date(2019, 9, 1).toLocaleDateString(), hebrewDate: 'ערב פסח תשע"ט' },
            { description: 'קבלה 0054', amount: 150, date: new Date(2019, 9, 5).toLocaleDateString(), hebrewDate: 'כא ניסן' },
          ], closingBalance: -95
        }
      },
      {
        userId: 1, payload: {
          fullName: 'משה זהבי', transactions: [
            { description: 'העברת יתרה', amount: 50, date: new Date(2019, 7, 1).toLocaleDateString(), hebrewDate: 'א תשרי' },
            { description: 'שביעי', amount: -20, date: new Date(2019, 7, 1).toLocaleDateString(), hebrewDate: 'א תשרי' },
            { description: 'מנחה', amount: -50, date: new Date(2019, 9, 1).toLocaleDateString(), hebrewDate: 'ערב פסח תשע"ט' },
            { description: 'ראשון', amount: -100, date: new Date(2019, 8, 18).toLocaleDateString(), hebrewDate: 'שמחת תורה' },
            { description: 'מוסף', amount: -100, date: new Date(2019, 8, 8).toLocaleDateString(), hebrewDate: 'ד חוה"מ סוכות' },
            { description: 'מפטיר', amount: -50, date: new Date(2019, 9, 1).toLocaleDateString(), hebrewDate: 'נח' },
            { description: 'קבלה 0054', amount: 300, date: new Date(2019, 9, 5).toLocaleDateString(), hebrewDate: 'כא ניסן' },
          ], closingBalance: 0
        }
      }
    ];

    return {
      users: users, transactions: transactions,
      transactionsSettings: {
        types: [
          'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי', 'מוסף', 'מפטיר', 'שחרית',
        ]
      },
      reports: reports,
      hebrewCalendar:hebrewCalendar
    };
  }


  constructor() { }
}
