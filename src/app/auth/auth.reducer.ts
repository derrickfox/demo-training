import { Action } from "@ngrx/store";
import { SET_UNAUTHENTICATED, SET_AUTHENTICATED, AuthActions } from "./auth.actions";

export interface State {
    isAuthenticated: boolean;
};

const initialState: State = {
    isAuthenticated: false
};

export function authReducer(state = initialState, action: AuthActions) {
    console.log('auth reducer -> action.type', action.type);
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                isAuthenticated: true
            };
        case SET_UNAUTHENTICATED:
            return {
                isAuthenticated: false
            };
        default: {
            return state;
        }
    }
}

export const getIsAuth = (state: State) => state.isAuthenticated;