import React, {Component} from 'react';
import {Panel} from 'react-bootstrap';
import {connect} from 'react-redux';
import {formatDate, orderPosts} from '../utils/utils';
import {withRouter} from "react-router";
import {_deletePost, SCREENS} from "../actions";
import {switchVisibleScreen} from "../actions/navigation";
import {_updateVotePost} from '../actions/posts';

class PostComponent extends Component {

    render() {
        const {visiblePosts, orderByField, updateVotePost, category} = this.props;
        return (<div className='visible-posts'>
            {visiblePosts && visiblePosts.length > 0 && orderPosts(visiblePosts, orderByField).map((post) => {
                const title = (
                    <h3>{post.title}</h3>
                );
                return (
                    <div key={post.id}>
                        <Panel
                            key={'panel_' + post.id}
                            header={<div>
                            <span>{title}</span>
                                <span>from: {post.author}</span>
                            <span className="controls">
                                    <a onClick={() => this.editPost(post)} className='control'><i
                                        className="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</a>
                                &nbsp;
                                <a onClick={() => this.deletePost(post, category)} className='control'><i
                                    className="fa fa-trash-o" aria-hidden="true"></i>Delete</a>
                                </span>
                            <span className='votes'>
                                    <i onClick={() => updateVotePost(post, 'upVote')} className='fa fa-thumbs-up'
                                       aria-hidden='true'></i>
                                    <i onClick={() => updateVotePost(post, 'downVote')} className='fa fa-thumbs-down'
                                       aria-hidden='true'></i>
                                    <span className='vote-score'>{post.voteScore}</span>
                                </span>
                            </div>}
                            footer={<span onClick={() => this.goToDetailView(post)}>Details</span>}>
                            <div className='post'>{post.body}</div>
                        </Panel>
                    </div>
                );
            })}
            {(!visiblePosts || visiblePosts.length === 0) && <div className='no-posts'>No posts in this category</div>}
        </div>);
    }

    goToDetailView(post) {
        this.props.history.push({pathname: `${post.category}/${post.id}`, state: post});
        this.props.navigate(SCREENS.POST_DETAILS);
    }

    editPost(post) {
        this.props.history.push({pathname: `/${post.category}/${post.id}/edit`, state: post});
        this.props.navigate(SCREENS.POST);
    }

    deletePost(post, category) {
        this.props.deletePost(post, category).then(()=> {
            this.props.history.push({pathname: `/${post.category}`});
            this.props.navigate(SCREENS.HOME);
        })

    }
}

function mapStateToProps({posts}) {
    return Object.assign({}, {visiblePosts: posts.visiblePosts});
}


function mapDispatchToProps(dispatch) {
    return {
        navigate: (data) => dispatch(switchVisibleScreen(data)),
        updateVotePost: ({id}, option) => dispatch(_updateVotePost(id, option)),
        deletePost: (post, category) => dispatch(_deletePost(post, category))
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(PostComponent));