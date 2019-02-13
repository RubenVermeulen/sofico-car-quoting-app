import { Injectable } from '@angular/core';
import { CarService } from './services/car.service';
import { FilterService } from './services/filter.service';
import { OptionService } from './services/option.service';
import { Observable } from 'rxjs';
import { Car } from './types/car.type';
import { FilterValue } from './types/filter-value.type';
import { Option } from './types/option.type';

@Injectable()
export class AppSandbox {
  // TODO: add a method that fetches all options based on the carId (hint: optionService)

  constructor(private carService: CarService,
              private filterService: FilterService,
              private optionService: OptionService) {
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
}
