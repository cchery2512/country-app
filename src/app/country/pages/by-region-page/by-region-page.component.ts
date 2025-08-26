import { Component, signal } from '@angular/core';
import { ListComponent } from "../../components/list/list.component";
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'by-region',
  imports: [ListComponent],
  templateUrl: './by-region-page.component.html',
  styles: ``
})
export class ByRegionPageComponent {
    public countries      = signal<Country[]>([]);
}
