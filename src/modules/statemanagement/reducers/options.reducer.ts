import { Option } from '../../app/types/option.type';
import { OptionsActions } from '../actions';
import { ActionTypes } from '../action-types';

export function optionsReducer(state: Option[] = [], action: OptionsActions): Option[] {
  switch (action.type) {
    case ActionTypes.ADD_OPTION:
      // TODO: replace the return value with a new list where the option has been added
      // TODO: make sure as well that the property "isSelected" of the new option is set to true
      // TODO: keep in mind the immutability
      return null;
    case ActionTypes.REMOVE_OPTION:
      // TODO: remove the option from the option list (hint: filter)
      // TODO: keep in mind the immutability
      return null;
    case ActionTypes.CLEAR_OPTIONS:
      return [];
    default:
      return state;
  }
}
