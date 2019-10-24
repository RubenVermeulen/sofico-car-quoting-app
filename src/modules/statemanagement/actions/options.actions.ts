import {Option} from '../../app/types/option.type';
import {createAction, props} from '@ngrx/store';

export const clearOptionsAction = createAction(
  'OPTIONS_CLEAR',
  props<{}>()
);

export const addOptionAction = createAction(
  'ADD_OPTION',
  props<{ option: Option; }>()
);

export const removeOptionAction = createAction(
  'REMOVE_OPTION',
  props<{ optionId: string; }>()
);
