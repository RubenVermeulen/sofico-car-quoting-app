import { Option } from '../../app/types/option.type';
import { OptionsActions } from '../actions';
import { ActionTypes } from '../action-types';

export function optionsReducer(state: Option[] = [], action: OptionsActions): Option[] {
  switch (action.type) {
    case ActionTypes.ADD_OPTION:
      return null;
    case ActionTypes.REMOVE_OPTION:
      return null;
    case ActionTypes.CLEAR_OPTIONS:
      return [];
    default:
      return state;
  }
}
