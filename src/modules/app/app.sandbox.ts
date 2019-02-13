import { Injectable } from '@angular/core';
import { CarService } from './services/car.service';
import { FilterService } from './services/filter.service';
import { OptionService } from './services/option.service';
import {
  never,
  Observable,
  Subject
} from 'rxjs';
import { Car } from './types/car.type';
import { FilterValue } from './types/filter-value.type';
import { Option } from './types/option.type';
import {
  select,
  Store
} from '@ngrx/store';
import { ApplicationState } from '../statemanagement/application.state';
import {
  AddOptionAction,
  ClearOptionsAction,
  RemoveOptionAction
} from '../statemanagement/actions';

@Injectable()
export class AppSandbox {
  leasePrice$ = this.store.pipe(select(state => state.leasePrice));
  // TODO: read the selectedOption from the store (hint: see leasePrice)
  selectedOptions$ = this.store.pipe(select(state => state.options));

  constructor(private carService: CarService,
              private filterService: FilterService,
              private optionService: OptionService,
              private store: Store<ApplicationState>) {
  }

  getCars(): Observable<Car[]> {
    return this.carService.find();
  }

  getCar(carId: string): Observable<Car> {
    return this.carService.findOne(carId);
  }

  getFilterMakes(): FilterValue[] {
    return this.filterService.filterMakes;
  }

  getFilterFuelTypes(): FilterValue[] {
    return this.filterService.filterFuelTypes;
  }

  getFilterGearboxes(): FilterValue[] {
    return this.filterService.filterGearboxes;
  }

  getOptions(carId: string): Observable<Option[]> {
    return this.optionService.find(carId);
  }

  clearOptions(): void {
    this.store.dispatch(new ClearOptionsAction());
  }

  addOption(option): void {
    // TODO: dispatch the new option to the store, with the correct instance of an action class
    this.store.dispatch(new AddOptionAction(option));
  }

  removeOption(optionId): void {
    // TODO: dispatch the optionId to the store, with the correct instance of an action class
    this.store.dispatch(new RemoveOptionAction(optionId));
  }
}
