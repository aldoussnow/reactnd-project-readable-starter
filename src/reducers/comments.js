import {ADD_COMMENT, ADD_COMMENTS, CLEAR_COMMENTS, DELETE_COMMENT, EDIT_COMMENT} from '../actions';
import * as _ from "lodash";

export default function comments(state = {}, action) {
    let comments = state.comments ? state.comments.slice() : [];
    switch (action.type) {
        case DELETE_COMMENT:
            return Object.assign({}, state, {comments: comments.filter((comment) => comment.id !== action.comment.id)});
        case ADD_COMMENT:
            return Object.assign({}, state, {comments: _.union(comments, [action.comment])});
        case ADD_COMMENTS:
            comments = _.union(comments, action.comments);
            return Object.assign({}, state, {comments});
        case CLEAR_COMMENTS:
            return Object.assign({}, state, {comments: []});
        case EDIT_COMMENT:
            return Object.assign({}, state, comments.map(comment => comment.id === action.comment.id ? action.comment : comment));
        default:
            return state;
    }

}

