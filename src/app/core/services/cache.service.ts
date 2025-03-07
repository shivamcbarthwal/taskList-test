import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * CacheService class provides methods for storing and retrieving data from cache.
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, any[]>(); // In-memory cache
  private cacheSubjects = new Map<string, BehaviorSubject<any[]>>(); // Observables for cache

  // ✅ Store data persistently using localStorage and update observable
  set(key: string, data: any[]): void {
    console.log(`🛠️ Updating Cache for key: ${key}`, data)
    localStorage.setItem(key, JSON.stringify(data));
    this.cache.set(key, [...data]);
    
    if (!this.cacheSubjects.has(key)) {
      this.cacheSubjects.set(key, new BehaviorSubject<any[]>(data));
    } 
    this.cacheSubjects.get(key)?.next([...data]);  
  }

  // ✅ Retrieve cached data from localStorage
  get(key: string): any[] {
    if (this.cache.has(key)) {
      return this.cache.get(key) || [];
    }
    const storedData = JSON.parse(localStorage.getItem(key) || '[]');
    this.cache.set(key, storedData);
    return storedData;
  }

  // ✅ Get cache as Observable (for components)
  getAsObservable(key: string): Observable<any[]> {
    if (!this.cacheSubjects.has(key)) {
      this.cacheSubjects.set(key, new BehaviorSubject<any[]>(this.get(key)));
    }
    return this.cacheSubjects.get(key)!.asObservable();
  }

  // ✅ Check if cache exists
  hasCache(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // ✅ Clear cache for a specific key
  clear(key: string): void {
    localStorage.removeItem(key);
    this.cache.delete(key);
    this.cacheSubjects.get(key)?.next([]);
  }
}