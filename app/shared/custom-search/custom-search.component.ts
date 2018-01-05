import {AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
@Component({
  selector: 'app-custom-search',
  templateUrl: './custom-search.component.html',
})
export class CustomSearchComponent {
  @Output()
  searchChange = new EventEmitter(true);
  @Output()
  doSearch = new EventEmitter(true);
  @Output()
  searchWordChange = new EventEmitter(true);
  @Input()
  searchWord = '';
  @Input()
  placeholder = '';

  watchSearch(event) {
    this.searchChange.emit(event);
  }
  doSearch_() {
    this.doSearch.emit(this.searchWord);
  }
}
