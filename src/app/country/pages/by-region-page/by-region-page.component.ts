import { Component, inject, signal } from '@angular/core';
import { ListComponent } from "../../components/list/list.component";
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Component({
  selector: 'by-region',
  imports: [ListComponent],
  templateUrl: './by-region-page.component.html',
  styles: ``
})
export class ByRegionPageComponent {
  public countryService = inject(CountryService);
  query = signal('');

  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => !this.query() ? of() : this.countryService.searchByCountry(request.query),
  });
}
