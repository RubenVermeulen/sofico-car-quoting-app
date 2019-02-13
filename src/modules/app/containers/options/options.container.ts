import {
  Component,
  OnInit
} from '@angular/core';
import { Option } from '../../types/option.type';
import { Observable } from 'rxjs';
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
import { AppSandbox } from '../../app.sandbox';

@Component({
  selector: 'app-options',
  styleUrls: ['./options.container.scss'],
  template: `
    <div class="row">
      <div class="col-sm-7 col-md-8">
        <h2>Packs</h2>
        <br>
        <app-option-list [options]="[]"
                         (addOption)="onAddOption($event)"
                         (removeOption)="onRemoveOption($event)"></app-option-list>
        <h2>Options</h2>
        <br>
        <app-option-list [options]="[]"
                         (addOption)="onAddOption($event)"
                         (removeOption)="onRemoveOption($event)"></app-option-list>
      </div>
      <div class="col-sm-5 col-md-4">
        <app-side-bar [car]="activeSelection$ | async">
        </app-side-bar>
      </div>
    </div>
  `
})
export class OptionsContainer implements OnInit {
  // TODO: remove both the car and the option service as dependency from this container (smart component)
  // TODO: add the sandbox as a dependency, and use it as a passthrough to get all the necessary data

  // source streams
  carId$: Observable<string>;

  // presentation streams
  activeSelection$: Observable<Car>;

  constructor(private activatedRoute: ActivatedRoute,
              private sb: AppSandbox) {
  }

  ngOnInit(): void {
    // source streams
    this.carId$ = this.activatedRoute.params.pipe(
      filter(params => params && params.carId),
      map(params => params.carId),
      publishReplay(1),
      refCount()
    );

    // presentation streams
    this.activeSelection$ = this.carId$.pipe(
      mergeMap(carId => this.sb.getCar(carId))
    );
  }

  onAddOption(option: Option): void {
  }

  onRemoveOption(optionId: string): void {
  }
}
