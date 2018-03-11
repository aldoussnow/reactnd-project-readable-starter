import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FormControl, FormGroup, Col, ControlLabel, Form} from 'react-bootstrap';
import * as _ from 'lodash';
import {_createPost, _editPost} from '../actions';
import {ButtonBar} from './ButtonBar';
import CommentComponent from "./CommentComponent";
import {SCREENS} from "../actions/navigation";
import {withRouter} from 'react-router';
import {getAuthor} from '../utils/api'

class CreatePostComponent extends Component {

    state = {
        post: {
            author: getAuthor(),
            title: '',
            body: '',
            category: 'select'
        }
    };

    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        let {categories} = this.props;
        let {handleChange} = this;
        categories = categories || [];
        return (
            <div className='form'>
                <Form onSubmit={this.submitForm} horizontal>
                    <FormGroup controlId="formHorizontalTitle">
                        <Col componentClass={ControlLabel} sm={2}>
                            Title
                        </Col>
                        <Col sm={10}>
                            <FormControl value={this.state.post.title} onChange={(ev) => handleChange(ev, 'title')}
                                         type="text" placeholder="Title"/>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalBody">
                        <Col componentClass={ControlLabel} sm={2}>
                            Body
                        </Col>
                        <Col sm={10}>
                            <FormControl value={this.state.post.body} onChange={(ev) => handleChange(ev, 'body')}
                                         type="text" placeholder="Body"/>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalAuthor">
                        <Col componentClass={ControlLabel} sm={2}>
                            Author
                        </Col>
                        <Col sm={10}>
                            <FormControl value={this.state.post.author} disabled type="text" placeholder="Author"/>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalCategory">
                        <Col componentClass={ControlLabel} sm={2}>
                            <ControlLabel>Select</ControlLabel>
                        </Col>
                        <Col sm={10}>
                            <FormControl value={this.state.post.category}
                                         onChange={(ev) => handleChange(ev, 'category')} componentClass="select"
                                         placeholder="Category">
                                <option value="select">Select</option>
                                {categories.map((category) => {
                                    return (
                                        <option key={category.path} value={category.namee}>{category.name}</option>
                                    );
                                })}
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalAuthor">
                        <Col componentClass={ControlLabel} sm={2}>
                            VoteScore
                        </Col>
                        <Col sm={10}>
                            <FormControl value={this.state.post.voteScore || 1} type="number" disabled
                                         placeholder="VoteScore"/>
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <ButtonBar
                            className="button-bar"
                            onCreatePostClicked={() => this.submitForm()}
                            disabled={Object.values(this.state.post).indexOf('') !== -1 || this.state.post.category === 'select'}
                            nextScreen={SCREENS.HOME}
                            buttonLabel={_.size(this.props.location.state) > 0 ? 'Edit Post' : 'Create Post'}/>
                    </FormGroup>
                </Form>
                {_.size(this.props.location.state) > 0 ? <CommentComponent key={'comment_' + this.state.post.id}
                                                                           postId={this.state.post.id || 'xxxx'}/> : undefined}
            </div>
        )
    }

    submitForm() {
        const {post} = this.state;
        if (_.size(this.props.location.state) > 0) {
            return this.props.editPost(post).then(() => {
                setTimeout(()=> this.props.history.push({pathname: `/${post.category}`}), 100);
            });
        } else {
            return this.props.createPost(Object.assign({}, {voteScore: 1}, post)).then(() => {
                setTimeout(()=> this.props.history.push({pathname: `/${post.category}`}), 100);
            });
        }
    }

    handleChange(ev, field) {
        this.setState({post: Object.assign({}, this.state.post, {[field]: ev.target.value})});
    }


    componentWillMount() {
        if (this.props.location.state) {
            this.setState({post: this.props.location.state});
        }
    }
}

function mapStateToProps({categories}) {
    return Object.assign({}, categories);
}

function mapDispatchToProps(dispatch) {
    return {
        createPost: (post) => dispatch(_createPost(post)),
        editPost: (post) => dispatch(_editPost(post))
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(CreatePostComponent));