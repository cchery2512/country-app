import { Component, input } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from "../../../shared/components/loading/loading.component";

@Component({
  selector: 'country-list',
  imports: [DecimalPipe, RouterLink, LoadingComponent],
  templateUrl: './list.component.html',
  styles: ``
})
export class ListComponent {
  countries = input.required<Country[]>();
  errorMessage = input.required<string|unknown>();
  isEmpty = input.required<boolean>();
  isLoading = input.required<boolean>();
}
