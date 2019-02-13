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
import { AppSandbox } from '../../app.sandbox';

@Component({
  selector: 'app-options',
  styleUrls: ['./options.container.scss'],
  template: `
    <div class="row">
      <div class="col-sm-7 col-md-8">
        <h2>Packs</h2>
        <br>
        <app-option-list [options]="packs$ | async"
                         (addOption)="onAddOption($event)"
                         (removeOption)="onRemoveOption($event)"></app-option-list>
        <h2>Options</h2>
        <br>
        <app-option-list [options]="singleOptions$ | async"
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
  // source streams
  carId$: Observable<string>;

  // intermediate streams
  options$: Observable<Option[]>;
  selectedOptions$: Observable<Option[]>;
  combinedOptions$: Observable<Option[]>;

  // presentation streams
  activeSelection$: Observable<Car>;
  packs$: Observable<Option[]>;
  singleOptions$: Observable<Option[]>;

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

    // intermediate streams
    // TODO: fetch all options, based on this.carId$ (hint: mergeMap)
    this.options$ = new Subject();

    this.selectedOptions$ = new Subject();
    this.combinedOptions$ = new Subject();

    // presentation streams
    this.activeSelection$ = this.carId$.pipe(
      mergeMap(carId => this.sb.getCar(carId))
    );

    // TODO: based on the this.options$ extract only the options that have optionType === 'pack' (hint: map)
    this.packs$ = new Subject();
    /// TODO: based on the this.options$ extract only the options that have optionType === 'option' (hint: map)
    this.singleOptions$ = new Subject();
  }

  onAddOption(option: Option): void {

  }

  onRemoveOption(optionId: string): void {

  }
}
