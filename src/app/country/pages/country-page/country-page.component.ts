import { Component, inject } from '@angular/core';

import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { LoadingComponent } from "../../../shared/components/loading/loading.component";
import { NotFoundComponent } from "../../../shared/components/errors/not-found/not-found.component";
import { CountryInformationComponent } from "./country-information/country-information.component";

@Component({
  selector: 'app-country-page',
  imports: [LoadingComponent, NotFoundComponent, CountryInformationComponent],
  templateUrl: './country-page.component.html',
  styles: ``
})
export class CountryPageComponent {
  countryService = inject(CountryService);
  //countryCode = inject(ActivatedRoute).snapshot.params['code'];
  countryCode = toSignal(inject(ActivatedRoute).params.pipe(
    map(params => params['code'] ?? '')
  ));
  countryResource = rxResource({
      request: () => ({ code: this.countryCode() }),
      loader: ({ request }) => !this.countryCode ? of() : this.countryService.searchByCountryByAlphCode(request.code),
  });
}
