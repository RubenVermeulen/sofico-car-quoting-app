import {
  Component,
  OnInit
} from '@angular/core';
import { Option } from '../../types/option.type';
import {
  combineLatest,
  Observable
} from 'rxjs';
import { Car } from '../../types/car.type';
import { ActivatedRoute } from '@angular/router';
import {
  filter,
  map,
  mergeMap,
  publishReplay,
  refCount,
  tap
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
        <app-side-bar [car]="activeSelection$ | async"
                      [selectedOptions]="selectedOptions$ | async"
                      [leasePrice]="leasePrice$ | async"
                      selectedOptionsEnabled="true">
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
  leasePrice$: Observable<number>;

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
    this.options$ = this.carId$.pipe(
      mergeMap(carId => this.sb.getOptions(carId))
    );

    this.selectedOptions$ = this.sb.selectedOptions$;
    this.combinedOptions$ = combineLatest(
      this.options$,
      this.selectedOptions$
    ).pipe(
      map(([options, selectedOptions]) => unionBy(selectedOptions, options, 'optionId')),
      map(options => sortBy(options, 'description'))
    );

    // presentation streams
    this.activeSelection$ = this.carId$.pipe(
      mergeMap(carId => this.sb.getCar(carId))
    );

    this.packs$ = this.combinedOptions$.pipe(
      map(options => options.filter(option => option.optionType === 'pack'))
    );
    this.singleOptions$ = this.combinedOptions$.pipe(
      map(options => options.filter(option => option.optionType === 'option'))
    );
    this.leasePrice$ = this.sb.leasePrice$;
  }

  onAddOption(option: Option): void {
    this.sb.addOption(option);
  }

  onRemoveOption(optionId: string): void {
    this.sb.removeOption(optionId);
  }
}
