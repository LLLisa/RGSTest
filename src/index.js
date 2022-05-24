// import { genericLoader } from '../store';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store, { GS } from '../store';
import { connect } from 'react-redux';

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidMount() {
    GS.models.forEach((model) => {
      this.props.genericLoad(model);
    });
  }

  handleOnChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleOnClick(ev) {
    ev.preventDefault();
    const output = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    };
    console.log(output);
    this.props.genericPost('users', output);
    this.setState({
      firstName: '',
      lastName: '',
    });
  }

  render() {
    return (
      <div>
        <h1>Press F12</h1>
        <form>
          <input
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleOnChange}
          ></input>
          <input
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleOnChange}
          ></input>
          <button onClick={this.handleOnClick}>submit</button>
        </form>
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    genericLoad: (slice) => dispatch(GS.genericLoad(slice)),
    genericPost: (slice, data) => dispatch(GS.genericPost(slice, data)),
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
