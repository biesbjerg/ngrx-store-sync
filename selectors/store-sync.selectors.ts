import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromStoreSync from '../reducers/store-sync.reducer';

const getStoreSyncState = createFeatureSelector<fromStoreSync.State>('storeSync');

export const getIsInitialized = createSelector(
	getStoreSyncState,
	fromStoreSync.selectIsInitialized
);
export const getSaveError = createSelector(
	getStoreSyncState,
	fromStoreSync.selectSaveError
);
export const getRestoreError = createSelector(
	getStoreSyncState,
	fromStoreSync.selectRestoreError
);
