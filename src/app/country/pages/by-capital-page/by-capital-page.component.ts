import { Component, inject, resource, signal } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { ListComponent } from "../../components/list/list.component";
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, ListComponent],
  templateUrl: './by-capital-page.component.html',
  styles: ``
})
export class ByCapitalPageComponent {
  public countryService = inject(CountryService);
  query = signal('', {equal: () => false});

  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => !this.query() ? of([]) : this.countryService.searchByCapital(request.query),
  });

  // countryResource = resource({
  //   request: () => ({ query: this.query() }),
  //   loader: async({ request }) => {
  //     if(!this.query()) return [];
  //     return await firstValueFrom( this.countryService.searchByCapital(request.query) );
  //   },
  // });



}
