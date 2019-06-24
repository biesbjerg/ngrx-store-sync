import { Injectable, Inject, InjectionToken } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Action, INIT, UPDATE } from '@ngrx/store';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Storage } from '@ionic/storage';
import { mergeWith, includes, isArray, omit, pick } from 'lodash-es';

import { StoreSyncActions } from '../actions';

export interface StoreSyncConfig {
	storageKey?: string;
	actionWhitelist?: string[];
	actionBlacklist?: string[];
	includeKeys?: string[];
	excludeKeys?: string[];
	saveDelay?: number;
	saveDebounce?: number;
}

const defaultConfig: StoreSyncConfig = {
	storageKey: 'STORE_SYNC_APP_STATE',
	actionWhitelist: [],
	actionBlacklist: [
		ROOT_EFFECTS_INIT,
		INIT,
		UPDATE,
		StoreSyncActions.ActionTypes.RestoreState,
		StoreSyncActions.ActionTypes.RestoreStateSuccess,
		StoreSyncActions.ActionTypes.RestoreStateFailure,
		StoreSyncActions.ActionTypes.SaveState,
		StoreSyncActions.ActionTypes.SaveStateSuccess,
		StoreSyncActions.ActionTypes.SaveStateFailure
	],
	includeKeys: [],
	excludeKeys: ['storeSync'],
	saveDelay: 50,
	saveDebounce: 1000
};

export const STORE_SYNC_CONFIG_TOKEN = new InjectionToken<StoreSyncConfig>('StoreSyncConfig');

@Injectable()
export class StoreSyncService {

	public config: StoreSyncConfig;

	public constructor(
		protected platform: Platform,
		protected storage: Storage, @Inject(STORE_SYNC_CONFIG_TOKEN) config: StoreSyncConfig
	) {
		this.config = mergeWith({}, defaultConfig, config, (objVal, srcVal) => {
			if (isArray(objVal)) {
				return [...objVal, ...srcVal];
			}
		});
	}

	public async fetchState(): Promise<any> {
		await this.platform.ready();
		return this.storage
			.get(this.config.storageKey)
			.then(state => this.cleanState(state) || {})
			.catch(() => {});
	}

	public async saveState(state: any): Promise<any> {
		await this.platform.ready();
		return this.storage.set(this.config.storageKey, this.cleanState(state));
	}

	public shouldTriggerSaveState(action: Action): boolean {
		if (!this.isActionWhitelisted(action)) {
			return false;
		}
		if (this.isActionBlacklisted(action)) {
			return false;
		}
		return true;
	}

	protected isActionWhitelisted(action: Action) {
		if (this.config.actionWhitelist.length < 1) {
			return true;
		}
		return includes(this.config.actionWhitelist, action.type);
	}

	protected isActionBlacklisted(action: Action) {
		return includes(this.config.actionBlacklist, action.type);
	}

	protected cleanState(state: any): any {
		if (this.config.includeKeys.length > 0) {
			state = pick(state, this.config.includeKeys);
		}
		if (this.config.excludeKeys.length > 0) {
			state = omit(state, this.config.excludeKeys);
		}
		return state;
	}

}
