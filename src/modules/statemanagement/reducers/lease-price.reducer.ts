import {setLeasePriceAction} from '../actions';
import {Action, createReducer, on} from '@ngrx/store';

const initialState: number = null;
const reducer = createReducer(
  initialState,
  on(
    setLeasePriceAction,
    (state, {leasePrice}) => leasePrice
  )
);

export function leasePriceReducer(state: number = null, action: Action): number {
  return reducer(state, action);
}
