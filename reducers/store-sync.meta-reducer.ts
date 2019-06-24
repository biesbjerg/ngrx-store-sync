import { ActionReducer } from '@ngrx/store';

import { merge } from 'lodash-es';

import { StoreSyncActions } from '../actions';

export function storeSync(reducer: ActionReducer<any>): ActionReducer<any> {
	return (state: any, action: any) => {
		if (action.type === StoreSyncActions.ActionTypes.RestoreStateSuccess) {
			state = merge({}, state, action.state);
		}
		return reducer(state, action);
	};
}
