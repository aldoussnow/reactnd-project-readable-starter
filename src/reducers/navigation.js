import {SWITCH_VISIBLE_SCREEN} from '../actions';

export default function navigation(state = {}, action) {
    switch (action.type) {
        case SWITCH_VISIBLE_SCREEN:
            return Object.assign({}, state, {visibleScreen: action.visibleScreen});
        default:
            return state;
    }
}