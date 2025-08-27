import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
  styles: ``
})
export class SearchInputComponent {
  value = output<string>();
  placeholder = input('Buscar');

  initialValue = input<string>();
  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();
    const timeOut = setTimeout(() => {
      if(!!value) this.value.emit(value);
    }, 800);

    onCleanup(() => {
      clearTimeout(timeOut);
    });
  });
}
