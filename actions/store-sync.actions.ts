import { Action } from '@ngrx/store';

export enum ActionTypes {
	RestoreState = '[StoreSync] Restore State',
	RestoreStateSuccess = '[StoreSync] Restore State Success',
	RestoreStateFailure = '[StoreSync] Restore State Failure',
	SaveState = '[StoreSync] Save State',
	SaveStateSuccess = '[StoreSync] Save State Success',
	SaveStateFailure = '[StoreSync] Save State Failure'
}

export class RestoreState implements Action {
	public readonly type = ActionTypes.RestoreState;
}
export class RestoreStateSuccess implements Action {
	public readonly type = ActionTypes.RestoreStateSuccess;
	public constructor(public state: any) {}
}
export class RestoreStateFailure implements Action {
	public readonly type = ActionTypes.RestoreStateFailure;
	public constructor(public error: string) {}
}

export class SaveState implements Action {
	public readonly type = ActionTypes.SaveState;
	public constructor(public state: any) {}
}
export class SaveStateSuccess implements Action {
	public readonly type = ActionTypes.SaveStateSuccess;
	public constructor(public state: any) {}
}
export class SaveStateFailure implements Action {
	public readonly type = ActionTypes.SaveStateFailure;
	public constructor(public error: string) {}
}

export type ActionsUnion =
	| RestoreState
	| RestoreStateSuccess
	| RestoreStateFailure
	| SaveState
	| SaveStateSuccess
	| SaveStateFailure;
