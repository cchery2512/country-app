import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interfaces';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { CountryMapper } from '../mappers/country.mapper';
import { Country } from '../interfaces/country.interface';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({providedIn: 'root'})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>;

  searchByCapital(query: string): Observable<Country[]>{
    query = query.toLowerCase();

    if(this.queryCacheCapital.has(query)){
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    console.log(`Llegando al servidor por ${query}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
    .pipe(
      map((items) => CountryMapper.mapCountryItemsToCountryArray(items)),
      tap({ next: (countries) => this.queryCacheCapital.set(query, countries) }),
      catchError(this.customCatchErrors)
    );
  }

  searchByCountry(query: string): Observable<Country[]>{
    query = query.toLowerCase();

    if(this.loadFromLocalStorage('search_by_country.' + query).length > 0){
      return of(this.loadFromLocalStorage('search_by_country.' + query));
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
    .pipe(
      map((items) => CountryMapper.mapCountryItemsToCountryArray(items)),
      tap({ next: (countries) => this.setToLocalStorage('search_by_country.' +query, countries) }),
      delay(2000),
      catchError(this.customCatchErrors)
    );
  }

  searchByRegion(region: Region): Observable<Country[]>{

    if(this.loadFromLocalStorage('search_by_region.' + region).length > 0){
      return of(this.loadFromLocalStorage('search_by_region.' + region));
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`)
    .pipe(
      map((items) => CountryMapper.mapCountryItemsToCountryArray(items)),
      tap({ next: (countries) => this.setToLocalStorage('search_by_region.' +region, countries) }),
      delay(2000),
      catchError(this.customCatchErrors)
    );
  }

  searchByCountryByAlphCode(query: string): Observable<Country | undefined>{
    query = query.toLowerCase();
    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${query}`)
    .pipe(
      map((items) => CountryMapper.mapCountryItemsToCountryArray(items)),
      map( countries => countries.at(0) ),
      delay(2000),
      catchError(this.customCatchErrors)
    );
  }

  customCatchErrors(error: any):  Observable<never>{
    let errorMessage = 'Error desconocido al buscar países';
    if (error.status === 404) {
      errorMessage = 'El recurso que intenta consultar no existe.';
    } else if (error.status === 500) {
      errorMessage = 'Error del servidor. Por favor, intenta más tarde';
    } else if (error.status === 0 || error.status === 503) {
      errorMessage = 'Error de conexión. Verifica tu internet';
    } else if (error.status === 400) {
      errorMessage = 'Búsqueda inválida. Por favor, verifica el término';
    } else if (error.status === 429) {
      errorMessage = 'Demasiadas solicitudes. Por favor, espera un momento';
    }
    // Mantener el mismo objeto de error pero actualizar el mensaje
    error.message = errorMessage;
    return throwError(() => errorMessage);
  }

  private loadFromLocalStorage(query?: string): Country[] {
    if(!!query){
      const dataFromLocalStorage = localStorage.getItem(query) ?? '[]';
      const data = JSON.parse(dataFromLocalStorage);
      return data;
    }
    return [];
  };

  private setToLocalStorage(query: string, countries: Country[]): void{
    const data = JSON.stringify(countries);
    localStorage.setItem(query, data);
  }
}
