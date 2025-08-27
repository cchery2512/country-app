import { Country } from "../interfaces/country.interface";
import { RESTCountry } from "../interfaces/rest-countries.interfaces";

export class CountryMapper{
  static mapRESTCountryToCountry(item: RESTCountry): Country{
    return {
      cca2: item.cca2,
      flag: item.flag,
      svg: item.flags.svg,
      name: item?.translations['spa']?.common ?? item.name.common,
      capital: item.capital?.join(', '),
      poputation: item.population,
      region: item.region,
      subRegion: item.subregion
    };
  }

  static mapCountryItemsToCountryArray(items: RESTCountry[]): Country[]{
    return items.map(this.mapRESTCountryToCountry);
  }
}
