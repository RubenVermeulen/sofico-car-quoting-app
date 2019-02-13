import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {
  combineLatest,
  Observable
} from 'rxjs';
import { Car } from '../../types/car.type';
import {
  filter,
  map,
  mergeMap,
  startWith
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
      <div class="col-sm-7 col-md-8">
        <app-car-list [cars]="filteredCars$ | async"></app-car-list>
      </div>
      <div class="col-sm-5 col-md-4">
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
  // TODO: remove both the filter and the car service as dependency from this container (smart component)
  // TODO: add the sandbox as a dependency, and use it as a passthrough to get all the necessary data

  form: FormGroup;

  filterMakes: FilterValue[];
  filterFuelTypes: FilterValue[];
  filterGearboxes: FilterValue[];

  // source streams
  carId$: Observable<string>;
  cars$: Observable<Car[]>;

  // presentation streams
  filteredCars$: Observable<Car[]>;
  activeSelection$: Observable<Car>;

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
    this.cars$ = this.carService.find();

    // presentation streams
    this.filteredCars$ = combineLatest(
      this.cars$,
      this.form.get('makes').valueChanges.pipe(startWith([])),
      this.form.get('fuelTypes').valueChanges.pipe(startWith([])),
      this.form.get('gearboxes').valueChanges.pipe(startWith([]))
    ).pipe(
      map(([cars, filterMakes, filterFuelTypes, filterGearboxes]) => {
        return this.filterCars(
          cars,
          filterMakes,
          filterFuelTypes,
          filterGearboxes
        );
      })
    );
    this.activeSelection$ = this.carId$.pipe(
      mergeMap(carId => this.carService.findOne(carId))
    );
  }

  private filterCars(
    cars: Car[],
    filterMakes: FilterValue[],
    filterFuelTypes: FilterValue[],
    filterGearboxes: FilterValue[]
  ): Car[] {
    let tmpCars = cars;

    if (filterMakes.length > 0) {
      tmpCars = tmpCars.filter(car => !!filterMakes.find(filter => filter.filterId === car.make.makeId));
    }

    if (filterFuelTypes.length > 0) {
      tmpCars = tmpCars.filter(car => !!filterFuelTypes.find(filter => filter.filterId === car.fuelType.fuelTypeId));
    }

    if (filterGearboxes.length > 0) {
      tmpCars = tmpCars.filter(car => !!filterGearboxes.find(filter => filter.filterId === car.gearbox.gearboxId));
    }

    return tmpCars;
  }
}
