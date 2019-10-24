import {createAction, props} from '@ngrx/store';

export const setLeasePriceAction = createAction(
  'SET_LEASE_PRICE',
  props<{ leasePrice: number; }>()
);

