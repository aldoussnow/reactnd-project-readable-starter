import React, {Component} from 'react';
import '../style/App.css';
import 'font-awesome/css/font-awesome.min.css';
import {connect} from 'react-redux'
import {Route, Switch} from 'react-router-dom';
import {ButtonBar} from './ButtonBar';
import CategoryTab from './CategoryTab';
import CreatePostComponent from './CreatePost';
import {withRouter} from 'react-router';
import {SCREENS, switchVisibleScreen} from '../actions/navigation';
import store from '../store';
import {_fetchCategories, filterPosts, setCategory} from '../actions';
import {_fetchPosts} from '../actions';
import PostDetailComponent from "./PostDetailComponent";
import Loadable from 'react-loading-overlay';


class App extends Component {

    state = {
        loaderActive: true
    };

    constructor(props) {
        super(props);
        this.navigate = this.navigate.bind(this);
    }

    render() {
        return (
            <Loadable
                active={this.state.loaderActive}
                spinner
                text='Loading your content...'>
                <div className="readable-app">
                    <div className="readable-app-title">
                        <h1>Readable Starter</h1>
                    </div>
                    <Switch>
                    <Route path='/post' exact render={() => (
                        <div className="create-post-page">
                            <CreatePostComponent/>
                        </div>
                    )}/>
                    <Route path='/:category' exact render={() => (
                        <div className="home-page">
                            <CategoryTab/>
                            <ButtonBar
                                className="button-bar"
                                onCreatePostClicked={this.navigate}
                                nextScreen={SCREENS.POST}
                                buttonLabel={'Create Post'}/>
                        </div>
                    )}/>
                    <Route path='/:category/:post_id/edit' exact render={() => (
                        <div className="create-post-page">
                            <CreatePostComponent/>
                        </div>
                    )}/>
                    <Route path='/:category/:post_id' exact render={() => (
                        <div className="post-detail-page">
                            <PostDetailComponent/>
                            <ButtonBar
                                className="button-bar"
                                onCreatePostClicked={this.navigate}
                                nextScreen={SCREENS.POST}
                                buttonLabel={'Create Post'}/>
                        </div>
                    )}/>
                    </Switch>
                </div>
            </Loadable>

        );
    }

    navigate(visibleScreen) {
        return new Promise(resolve => {
            this.props.navigate(visibleScreen);
            resolve();
        })
    }

    componentDidMount() {
        store.dispatch(_fetchCategories()).then((categories) => {
            const {pathname} = this.props.location;
            const oCategory = pathname.split('/')[1];
            if (oCategory === '' || oCategory === 'all') {
                this.props.filterPosts('all');
                this.props.setCategory('all');
                this.props.history.push('/all');
                this.setState({loaderActive: false})
            } else {
                setTimeout(() => {
                    categories.forEach((category) => {
                        if (category.path == oCategory) {
                            this.props.filterPosts(category.path);
                            this.props.setCategory(category.path);
                        }
                    });
                    this.setState({loaderActive: false});
                }, 100);
            }

        });
        store.dispatch(_fetchPosts());
    }
}


function mapStateToProps({visibleScreen, categories}) {
    return {
        visibleScreen
    }
}

function mapDispatchToProps(dispatch) {
    return {
        navigate: (data) => dispatch(switchVisibleScreen(data)),
        filterPosts: (category) => dispatch(filterPosts(category)),
        setCategory: (category) => dispatch(setCategory(category))
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App));