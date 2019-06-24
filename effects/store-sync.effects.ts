import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, from, of } from 'rxjs';
import { catchError, map, exhaustMap, debounceTime, filter, concatMap, withLatestFrom, delay } from 'rxjs/operators';

import { StoreSyncActions } from '../actions';
import { StoreSyncService } from '../services/store-sync.service';

@Injectable()
export class StoreSyncEffects {

	@Effect()
	public restoreState$: Observable<Action> = this.actions$.pipe(
		ofType<StoreSyncActions.RestoreState>(StoreSyncActions.ActionTypes.RestoreState),
		exhaustMap(() =>
			from(this.storeSyncService.fetchState()).pipe(
				map(state => new StoreSyncActions.RestoreStateSuccess(state)),
				catchError(errorMessage => of(new StoreSyncActions.RestoreStateFailure(errorMessage)))
			)
		)
	);

	@Effect()
	public triggerSaveState$: Observable<Action> = this.actions$.pipe(
		filter(action => this.storeSyncService.shouldTriggerSaveState(action)),
		debounceTime(this.storeSyncService.config.saveDebounce),
		delay(this.storeSyncService.config.saveDelay),
		withLatestFrom(this.store$),
		map(([action, state]) => new StoreSyncActions.SaveState(state))
	);

	@Effect()
	public saveState$: Observable<Action> = this.actions$.pipe(
		ofType<StoreSyncActions.SaveState>(StoreSyncActions.ActionTypes.SaveState),
		map(action => action.state),
		concatMap(state =>
			from(this.storeSyncService.saveState(state)).pipe(
				map(() => new StoreSyncActions.SaveStateSuccess(state)),
				catchError(errorMessage => of(new StoreSyncActions.SaveStateFailure(errorMessage)))
			)
		)
	);

	public constructor(
		protected actions$: Actions,
		protected store$: Store<any>,
		protected storeSyncService: StoreSyncService
	) {}

}
