import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { Car } from '../../types/car.type';
import { FormGroup } from '@angular/forms';
import { FilterValue } from '../../types/filter-value.type';

@Component({
  selector: 'app-side-bar',
  styleUrls: ['./side-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-active-car-selection *ngIf="car" [car]="car"></app-active-car-selection>

    <app-filters *ngIf="filtersEnabled"
                 [form]="form"
                 [filterMakes]="filterMakes"
                 [filterFuelTypes]="filterFuelTypes"
                 [filterGearboxes]="filterGearboxes"></app-filters>
  `
})
export class SideBarComponent {
  @Input() car: Car;
  @Input() form: FormGroup;
  @Input() filterMakes: FilterValue[];
  @Input() filterFuelTypes: FilterValue[];
  @Input() filterGearboxes: FilterValue[];

  @Input() filtersEnabled = false;
}
