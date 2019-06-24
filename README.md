# ngrx-store-sync

`src/app/reducers/index.ts`:
```ts
import { ActionReducerMap, MetaReducer, ActionReducer, UPDATE, INIT } from '@ngrx/store';

import { storeSync } from '@app/store-sync/reducers';

export const reducers: ActionReducerMap<State> = {};
export const metaReducers: MetaReducer<any>[] = [storeSync];
```

`src/app/app.module.ts`:
```ts
import { reducers, metaReducers } from '@app/reducers';

...

@NgModule({
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		IonicStorageModule.forRoot(),
		StoreModule.forRoot(reducers, { metaReducers }),
		EffectsModule.forRoot([]),
		StoreSyncModule.forRoot({
			actionWhitelist: [
				AuthApiActions.ActionTypes.LoginSuccess,
				AuthApiActions.ActionTypes.LogoutSuccess,
				SettingsApiActions.ActionTypes.SetPreferredCatalogAndLanguage,
				SettingsPageActions.ActionTypes.SetCatalogAndLanguage,
				OnboardingPageActions.ActionTypes.SkipOnboarding
			],
			includeKeys: [
				'auth',
				'settings'
			]
		}),
		StoreRouterConnectingModule.forRoot(),
		...
	]
})
export class AppModule {}
```

`StoreSyncModule` has following config interface:
```ts
export interface StoreSyncConfig {
	storageKey?: string;
	actionWhitelist?: string[];
	actionBlacklist?: string[];
	includeKeys?: string[];
	excludeKeys?: string[];
	saveDelay?: number;
	saveDebounce?: number;
}
```
