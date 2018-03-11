import * as api from '../utils/api'
import {ADD_CATEGORY, SET_CATEGORY} from "./types";

export function addCategory(category) {
    return {
        type: ADD_CATEGORY,
        category
    }
}

export function setCategory(category) {
    return {
        type: SET_CATEGORY,
        category
    }
}

