import * as api from '../utils/api'
import {ADD_CATEGORIES} from "./types";

export function addCategories(categories) {
    return {
        type: ADD_CATEGORIES,
        categories
    }
}

export const _fetchCategories = () => dispatch =>
    new Promise((resolve) =>
        api
            .readCategories()
            .then(({categories}) => {
                dispatch(addCategories(categories));
                resolve(categories);
            })
    );

