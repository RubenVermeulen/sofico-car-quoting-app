import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  filter,
  map,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import {
  combineLatest,
  Observable,
  Subject
} from 'rxjs';
import { Step } from '../../types/step.type';
import { AppSandbox } from '../../app.sandbox';

@Component({
  selector: 'app-configurator',
  template: `
    <div class="steps">
      <ng-container *ngFor="let step of steps$ | async">
        <ng-container *ngIf="step?.accessible; else notAccessible">
          <a [routerLink]="step.path"
             routerLinkActive="active"
             class="step step-accessible">{{step?.label}}</a>
        </ng-container>
        <ng-template #notAccessible>
          <div class="step">{{step?.label}}</div>
        </ng-template>
      </ng-container>
    </div>
    <br>
    <router-outlet></router-outlet>
  `
})
export class ConfiguratorContainer implements OnInit, OnDestroy {
  // source streams
  destroy$: Subject<any>;
  carId$: Observable<string>;

  // presentation streams
  steps$: Observable<Step[]>;

  constructor(private activatedRoute: ActivatedRoute,
              private sb: AppSandbox) {
  }

  ngOnInit(): void {
    // source streams
    this.destroy$ = new Subject<any>();
    this.carId$ = this.activatedRoute.params.pipe(
      filter(params => params && params.carId),
      map(params => params.carId),
      publishReplay(1),
      refCount()
    );

    // presentation streams
    this.steps$ = this.getSteps$();

    this.carId$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.sb.clearOptions());

    // TODO: combine both the carId$ and selectedOptions$ and execute the calculation (hint: switchMap)
    // TODO: make sure you subscribe to your stream
    combineLatest(
      this.carId$,
      this.sb.selectedOptions$
    ).pipe(
      switchMap(([carId, options]) =>
        this.sb.calculate(
          carId,
          options.map(option => option.optionId)
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private getSteps$(): Observable<Step[]> {
    return this.carId$.pipe(
      startWith(null),
      map(carId => {
        return [
          {
            label: 'Car',
            path: '/configurator/' + (carId ? carId + '/cars' : 'cars'),
            accessible: true
          },
          {
            label: 'Options',
            path: carId ? '/configurator/' + carId + '/options' : null,
            accessible: !!carId
          },
          {
            label: 'Summary',
            path: carId ? '/configurator/' + carId + '/summary' : null,
            accessible: !!carId
          }
        ];
      })
    );
  }
}
