import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Car } from '../../types/car.type';
import {
  filter,
  map,
  mergeMap
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { CarService } from '../../services/car.service';
import { FilterValue } from '../../types/filter-value.type';

@Component({
  selector: 'app-cars',
  styleUrls: ['./cars.container.scss'],
  template: `
    <div class="row">
      <div class="col-8">
        <app-car-list [cars]="cars$ | async"></app-car-list>
      </div>
      <div class="col-4">
        <app-side-bar [car]="activeSelection$ | async"
                      [form]="form"
                      [filterMakes]="filterMakes"
                      [filterFuelTypes]="filterFuelTypes"
                      [filterGearboxes]="filterGearboxes"
                      [filtersEnabled]="true">
        </app-side-bar>
      </div>
    </div>`
})
export class CarsContainer implements OnInit {
  form: FormGroup;

  filterMakes: FilterValue[];
  filterFuelTypes: FilterValue[];
  filterGearboxes: FilterValue[];

  // source streams
  carId$: Observable<string>;

  // presentation streams
  activeSelection$: Observable<Car>;
  cars$: Observable<Car[]>;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private filterService: FilterService,
              private carService: CarService) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      makes: [[]],
      fuelTypes: [[]],
      gearboxes: [[]]
    });

    this.filterMakes = this.filterService.filterMakes;
    this.filterFuelTypes = this.filterService.filterFuelTypes;
    this.filterGearboxes = this.filterService.filterGearboxes;

    // source streams
    this.carId$ = this.activatedRoute.params.pipe(
      filter(params => params && params.carId),
      map(params => params.carId)
    );

    // presentation streams
    this.activeSelection$ = this.carId$.pipe(
      mergeMap(carId => this.carService.findOne(carId))
    );
    this.cars$ = this.carService.find();
  }
}
