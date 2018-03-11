import * as api from "../utils/api";
import {setCategory} from "./category";
import {ADD_POSTS, CREATE_POST, DELETE_POST, EDIT_POST, FILTER_POSTS, UPDATE_VOTE_POST} from "./types";

export function addPosts({posts}) {
    return {
        type: ADD_POSTS,
        posts
    }
}

export function createPost(post) {
    return {
        type: CREATE_POST,
        post
    }
}

export function editPost(post) {
    return {
        type: EDIT_POST,
        post
    }
}

export function filterPosts(category) {
    return {
        type: FILTER_POSTS,
        category
    }
}

export function updateVotePost(id, option) {
    return {
        type: UPDATE_VOTE_POST,
        id,
        option
    }
}

export function deletePost(post) {
    return {
        type: DELETE_POST,
        post
    }
}

export const _fetchPosts = () => dispatch => (
    api
        .readPosts()
        .then(posts => {
            dispatch(addPosts({posts}));
            dispatch(filterPosts('all'));
        })
);

export const _createPost = (post) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .createPost(post)
            .then((serverPost)=> {
                dispatch(createPost(serverPost));
                dispatch(filterPosts(post.category));
                dispatch(setCategory(post.category));
                resolve();
            }, (error) => reject(error));
    });
};

export const _editPost = (post) => dispatch => {
    return new Promise((resolve, reject) => {
       api
           .updatePost(post)
           .then(() => {
              dispatch(editPost(post));
              dispatch(filterPosts(post.category));
              dispatch(setCategory(post.category));
              resolve();
           }, (error) => reject(error));
    });
};

export const _updateVotePost = (id, option) => dispatch => {

    return new Promise((resolve, reject) => {
        api
            .updateVotePost(id, option)
            .then(()=> {
                dispatch(updateVotePost(id, option));
                resolve();
            }, (error) => reject(error));
    });
};

export const _deletePost = (post, category) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .deletePost(post)
            .then(()=> {
                dispatch(deletePost(post));
                dispatch(filterPosts(category || post.category));
                dispatch(setCategory(category || post.category));
                resolve();
            }, (error) => reject(error));
    })
}

