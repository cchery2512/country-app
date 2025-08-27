import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ListComponent } from "../../components/list/list.component";
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { Region } from '../../interfaces/region.type';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'by-region',
  imports: [ListComponent],
  templateUrl: './by-region-page.component.html',
  styles: ``
})
export class ByRegionPageComponent {
  public countryService = inject(CountryService);

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';

  //Es una señal escribible que mantiene una conexión bidireccional con una expresión
  //Es decir que puede tanto leer un valor como escribir en caso de que la expresión cambie.
  selectedRegion = linkedSignal<Region>(() => this.validateQueryParam(this.queryParam));

  countryResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {
      this.router.navigate(['/country/by-region'], {
        queryParams: {
          region: request.region
        }
      });
      return !this.selectedRegion() ? of([]) : this.countryService.searchByRegion(request.region!);
    }
  });

  validateQueryParam(queryParam: string): Region{
    queryParam = queryParam.toLowerCase();

    const validRegions: Record<string, Region> = {
      'africa':   'Africa',
      'americas': 'Americas',
      'asia':     'Asia',
      'europe':   'Europe',
      'oceania':  'Oceania',
      'antartic': 'Antarctic',
    }
    return validRegions[queryParam] ?? 'Americas';
  }

  // selectRegion(region: Region){
  //   this.selectedRegion.set(region);
  // }
}
