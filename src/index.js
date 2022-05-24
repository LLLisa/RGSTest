import { genericLoader } from '../store';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../store';
import { connect } from 'react-redux';

class Main extends React.Component {
  componentDidMount() {
    console.log(this.props);
    this.props.genericLoader('users');
  }

  render() {
    return <div>Press F12</div>;
  }
}

const mapDispatch = (dispatch) => {
  return {
    genericLoader: (slice) => dispatch(genericLoader(slice)),
  };
};

const App = connect((state) => state, mapDispatch)(Main);

class Root extends React.Component {
  render() {
    return <App />;
  }
}

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <Root />
  </Provider>
);
