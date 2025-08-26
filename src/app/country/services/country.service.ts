import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interfaces';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { CountryMapper } from '../mappers/country.mapper';
import { Country } from '../interfaces/country.interface';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({providedIn: 'root'})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]>{
    console.log(Date.now());
    query = query.toLowerCase();
    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
    .pipe(
      map((items) => CountryMapper.mapCountryItemsToCountryArray(items)),
      catchError(this.customCatchErrors)
    );
  }

  searchByCountry(query: string): Observable<Country[]>{
    query = query.toLowerCase();
    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
    .pipe(
      map((items) => CountryMapper.mapCountryItemsToCountryArray(items)),
      delay(2000),
      catchError(this.customCatchErrors)
    );
  }

  searchByCountryByAlphCode(query: string): Observable<Country | undefined>{
    console.log(Date.now());
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
}
