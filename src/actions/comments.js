import * as api from "../utils/api";
import {ADD_COMMENT, ADD_COMMENTS, CLEAR_COMMENTS, DELETE_COMMENT, EDIT_COMMENT} from "./types";

export function addComments(comments) {
    return {
        type: ADD_COMMENTS,
        comments
    }
}

export function clearComments() {
    return {
        type: CLEAR_COMMENTS
    }
}

export function addComment(comment) {
    return {
        type: ADD_COMMENT,
        comment
    }
}

export function deleteComment(comment) {
    return {
        type: DELETE_COMMENT,
        comment
    }
}

export function editComment(comment) {
    return {
        type: EDIT_COMMENT,
        comment
    }
}

export const _deleteComment = (comment) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .deleteComment(comment)
            .then(()=> {
                dispatch(deleteComment(comment));
                resolve();
            }, (error) => reject(error));
    });
};

export const _editComment = (comment) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .updateComment(comment)
            .then(()=> {
                dispatch(editComment(comment));
                resolve();
            }, (error) => reject(error));
    });
};

export const _addComment = newComment => dispatch => {
    return new Promise((resolve, reject) => {
       api
           .createComment(newComment)
           .then((comment) => {
               dispatch(addComment(comment));
               resolve();
           }, (error) => reject(error));
    });
}


