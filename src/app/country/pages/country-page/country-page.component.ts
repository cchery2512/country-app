import { Component, inject } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [],
  templateUrl: './country-page.component.html',
  styles: ``
})
export class CountryPageComponent {
  query = toSignal(inject(ActivatedRoute).params.pipe(
    map(params => params['code'] ?? '')
  ));
  constructor(){
    console.log(this.query());
  }
}
