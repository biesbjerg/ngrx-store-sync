import { StoreSyncActions } from '../actions';

export interface State {
	initialized: boolean;
	saveError: string | null;
	restoreError: string | null;
}

const initialState: State = {
	initialized: false,
	saveError: null,
	restoreError: null
};

export function storeSyncReducer(state = initialState, action: StoreSyncActions.ActionsUnion): State {
	switch (action.type) {
		case StoreSyncActions.ActionTypes.RestoreStateSuccess: {
			return {
				...state,
				initialized: true,
				restoreError: null
			};
		}

		case StoreSyncActions.ActionTypes.RestoreStateFailure: {
			return {
				...state,
				initialized: true,
				restoreError: action.error
			};
		}

		case StoreSyncActions.ActionTypes.SaveStateSuccess: {
			return {
				...state,
				saveError: null
			};
		}

		case StoreSyncActions.ActionTypes.SaveStateFailure: {
			return {
				...state,
				saveError: action.error
			};
		}

		default: {
			return state;
		}
	}
}

export const selectIsInitialized = (state: State) => state.initialized;
export const selectSaveError = (state: State) => state.saveError;
export const selectRestoreError = (state: State) => state.restoreError;
