import { NgModule, APP_INITIALIZER, Inject, ModuleWithProviders } from '@angular/core';

import { StoreModule, Store, select } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { take, filter } from 'rxjs/operators';

import { StoreSyncService, StoreSyncConfig, STORE_SYNC_CONFIG_TOKEN } from './services';
import { State, storeSyncReducer } from './reducers';
import { StoreSyncActions } from './actions';
import { StoreSyncEffects } from './effects';
import { StoreSyncSelectors } from './selectors';

export function initializeApp(store$: Store<State>): Function {
	return () => new Promise(resolve => {
		store$.dispatch(new StoreSyncActions.RestoreState());
		store$.pipe(
			select(StoreSyncSelectors.getIsInitialized),
			filter(isInitialized => isInitialized),
			take(1)
		)
		.subscribe(() => {
			resolve(true);
		});
	});
}

@NgModule({
	imports: [
		StoreModule.forFeature('storeSync', storeSyncReducer),
		EffectsModule.forFeature([StoreSyncEffects])
	],
	providers: [
		StoreSyncService,
		{
			provide: APP_INITIALIZER,
			useFactory: initializeApp,
			multi: true,
			deps: [
				[new Inject(Store)]
			]
		}
	],
})
export class StoreSyncModule {
	public static forRoot(config?: StoreSyncConfig): ModuleWithProviders {
		return {
			ngModule: StoreSyncModule,
			providers: [
				{
					provide: STORE_SYNC_CONFIG_TOKEN,
					useValue: config
				}
			]
		};
	}
}
