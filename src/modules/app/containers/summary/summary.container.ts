import {
  Component,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { Option } from '../../types/option.type';
import { Car } from '../../types/car.type';
import {
  filter,
  map,
  mergeMap
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { sortBy } from 'lodash';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-summary',
  template: `
    <div class="row">
      <div class="col-sm-7 col-md-8">
        <h2>Selected options</h2>
        <br>
        <app-option-list [options]="selectedOptions$ | async" [disabled]="true"></app-option-list>
      </div>
      <div class="col-sm-5 col-md-4">
        <app-side-bar [car]="activeSelection$ | async"></app-side-bar>
      </div>
    </div>
  `
})
export class SummaryContainer implements OnInit {
  // source streams
  carId$: Observable<string>;

  // presentation streams
  activeSelection$: Observable<Car>;
  selectedOptions$: Observable<Option[]>;

  constructor(private activatedRoute: ActivatedRoute,
              private carService: CarService) {
  }

  ngOnInit(): void {
    // source streams
    this.carId$ = this.activatedRoute.params.pipe(
      filter(params => params && params.carId),
      map(params => params.carId)
    );


    // presentation streams
    this.activeSelection$ = this.carId$.pipe(
      mergeMap(carId => this.carService.findOne(carId))
    );
  }
}
