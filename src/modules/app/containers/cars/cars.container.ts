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

@Component({
  selector: 'app-cars',
  styleUrls: ['./cars.container.scss'],
  template: `
    <div class="row">
      <div class="col-sm-7 col-md-8">
        <app-car-list></app-car-list>
      </div>
      <div class="col-sm-5 col-md-4">
        <app-side-bar [car]="activeSelection$ | async"
                      [form]="form"
                      [filtersEnabled]="true">
        </app-side-bar>
      </div>
    </div>`
})
export class CarsContainer implements OnInit {
  form: FormGroup;

  // source streams
  carId$: Observable<string>;

  // presentation streams
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

    // source streams
    this.carId$ = this.activatedRoute.params.pipe(
      filter(params => params && params.carId),
      map(params => params.carId)
    );

    this.activeSelection$ = this.carId$.pipe(
      mergeMap(carId => this.carService.findOne(carId))
    );
  }
}
