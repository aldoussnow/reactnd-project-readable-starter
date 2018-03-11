import {SET_CATEGORY} from "../actions";

export default function categories(state = {}, action) {
    switch (action.type) {
        case SET_CATEGORY:
            return Object.assign({}, state, {category: action.category});
        default:
            return state;
    }

}