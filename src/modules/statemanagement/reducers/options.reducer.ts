import {Option} from '../../app/types/option.type';
import {Action, createReducer, on} from '@ngrx/store';
import {addOptionAction, clearOptionsAction, removeOptionAction} from '../actions';

const initialState: Option[] = [];
const reducer = createReducer(
  initialState,
  on(
    clearOptionsAction,
    () => []
  ),
  on(
    addOptionAction,
    (state, {option}) => [...state, {...option, isSelected: true}]
  ),
  on(
    removeOptionAction,
    (state, {optionId}) => state.filter(option => option.optionId !== optionId)
  )
);

export function optionsReducer(state: Option[] = [], action: Action): Option[] {
  return reducer(state, action);
}

