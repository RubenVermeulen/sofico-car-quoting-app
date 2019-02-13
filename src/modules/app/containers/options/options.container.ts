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
      <div class="col-8">
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
      <div class="col-4">
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
  leasePrice$: Observable<number>;

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
    this.options$ = this.carId$.pipe(
      mergeMap(carId => this.optionService.find(carId))
    );

    // TODO
    this.selectedOptions$ = new Subject();
    // TODO
    // unionBy(selectedCatalogOptions, catalogOptions, 'optionId')
    this.combinedOptions$ = new Subject();

    // presentation streams
    this.activeSelection$ = this.carId$.pipe(
      mergeMap(carId => this.carService.findOne(carId))
    );

    // TODO
    this.packs$ = new Subject();
    // TODO
    this.singleOptions$ = new Subject();
    // TODO
    this.leasePrice$ = new Subject();
  }

  onAddOption(option: Option): void {
    // TODO
  }

  onRemoveOption(optionId: string): void {
    // TODO
  }
}
