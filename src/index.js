import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './components/App';
import { Router } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store'

import createHistory from 'history/createBrowserHistory';

const history = createHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}><App/></Router>
    </Provider>,
    document.getElementById('root'));
