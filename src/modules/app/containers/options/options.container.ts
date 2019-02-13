import {
  Component,
  OnInit
} from '@angular/core';
import { Option } from '../../types/option.type';
import {
  Observable,
  Subject
} from 'rxjs';
import { Car } from '../../types/car.type';
import { ActivatedRoute } from '@angular/router';
import {
  filter,
  map,
  mergeMap,
  publishReplay,
  refCount
} from 'rxjs/operators';
import {
  sortBy,
  unionBy
} from 'lodash';
import { CarService } from '../../services/car.service';
import { OptionService } from '../../services/option.service';

@Component({
  selector: 'app-options',
  styleUrls: ['./options.container.scss'],
  template: `
    <div class="row">
      <div class="col-sm-7 col-md-8">
        <h2>Packs</h2>
        <br>
        <app-option-list [options]="[]"></app-option-list>
        <h2>Options</h2>
        <br>
        <app-option-list [options]="[]"></app-option-list>
      </div>
      <div class="col-sm-5 col-md-4">
        <app-side-bar [car]="activeSelection$ | async"></app-side-bar>
      </div>
    </div>
  `
})
export class OptionsContainer implements OnInit {
  // source streams
  carId$: Observable<string>;

  // intermediate streams
  options$: Observable<Option[]>;

  // presentation streams
  activeSelection$: Observable<Car>;

  constructor(private activatedRoute: ActivatedRoute,
              private carService: CarService,
              private optionService: OptionService) {
  }

  ngOnInit(): void {
    // source streams
    this.carId$ = this.activatedRoute.params.pipe(
      filter(params => params && params.carId),
      map(params => params.carId),
      publishReplay(1),
      refCount()
    );

    // intermediate streams
    this.options$ = new Subject();

    // presentation streams
    this.activeSelection$ = this.carId$.pipe(
      mergeMap(carId => this.carService.findOne(carId))
    );
  }
}
