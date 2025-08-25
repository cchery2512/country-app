import { Component, inject } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { ListComponent } from "../../components/list/list.component";
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, ListComponent],
  templateUrl: './by-capital-page.component.html',
  styles: ``
})
export class ByCapitalPageComponent {
  public countryService = inject(CountryService);

  onSearch(value: string){
    this.countryService.searchByCapital(value)
    .subscribe({
      next: (resp) => {
        console.log(resp);
      },
      error: (error) => {
        if(error.status == 404){
          console.log(error.message);
        }else{
          console.log(error.status);
        }
      }
    });
  }
}
