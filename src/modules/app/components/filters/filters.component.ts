import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FilterValue } from '../../types/filter-value.type';
import { FormGroup } from '@angular/forms';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filters',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h5>Filters</h5>
    <h6>Make</h6>
    <app-form-control-multi-checkbox *ngIf="form.get('makes') as ctrl"
                                     [formControl]="ctrl"
                                     [filters]="filterMakes"></app-form-control-multi-checkbox>
    <br>
    <h6>Fuel type</h6>
    <app-form-control-multi-checkbox *ngIf="form.get('fuelTypes') as ctrl"
                                     [formControl]="ctrl"
                                     [filters]="filterFuelTypes"></app-form-control-multi-checkbox>
    <br>
    <h6>Gearbox</h6>
    <app-form-control-multi-checkbox *ngIf="form.get('gearboxes') as ctrl"
                                     [formControl]="ctrl"
                                     [filters]="filterGearboxes"></app-form-control-multi-checkbox>
  `
})
export class FiltersComponent implements OnInit {
  // TODO: as a dumb component it's not allowed to fetch data
  // TODO: move the responsibilities of fetching data to the respective smart component
  // TODO: and pass along the data from top to bottom using the @Input decorator
  // TODO: update the template accordingly (the async pipe is not necessary anymore)

  @Input() form: FormGroup;

  filterMakes: FilterValue[];
  filterFuelTypes: FilterValue[];
  filterGearboxes: FilterValue[];

  constructor(private filterService: FilterService) {
  }

  ngOnInit(): void {
    this.filterMakes = this.filterService.filterMakes;
    this.filterFuelTypes = this.filterService.filterFuelTypes;
    this.filterGearboxes = this.filterService.filterGearboxes;
  }
}
