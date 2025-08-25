import { Component } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { ListComponent } from "../../components/list/list.component";

@Component({
  selector: 'by-country',
  imports: [SearchInputComponent, ListComponent],
  templateUrl: './by-country-page.component.html',
  styles: ``
})
export class ByCountryPageComponent {
  onSearch(value: string){
    console.log(value);
  }
}
