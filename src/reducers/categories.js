import {ADD_CATEGORIES} from "../actions";
import * as _ from 'lodash';

export default function categories(state = [], action) {
    let categories = state.categories ? state.categories.slice() : [];
    switch (action.type) {
        case ADD_CATEGORIES:
            categories = _.union(categories, action.categories);
            return Object.assign({}, state, {categories});
        default:
            return state;
    }

}