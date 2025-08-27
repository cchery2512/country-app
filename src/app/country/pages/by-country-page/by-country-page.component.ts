import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { ListComponent } from "../../components/list/list.component";
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'by-country',
  imports: [SearchInputComponent, ListComponent],
  templateUrl: './by-country-page.component.html',
  styles: ``
})
export class ByCountryPageComponent {
  public countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  //Es una señal escribible que mantiene una conexión bidireccional con una expresión
  //Es decir que puede tanto leer un valor como escribir en caso de que la expresión cambie.
  query = linkedSignal(() => this.queryParam, {equal: () => false});

  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      this.router.navigate(['/country/by-country'], {
        queryParams: {
          query: request.query
        }
      });
      return !this.query() ? of([]) : this.countryService.searchByCountry(request.query);
    }
  });
}
