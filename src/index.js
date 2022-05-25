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
      selectedUser: {},
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    GS.models.forEach((model) => {
      this.props.genericLoad('/api/', model);
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.users.length && this.props.users.length) {
      this.setState({ selectedUser: this.props.users[0] });
    }
  }

  handleOnChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleSelect(ev) {
    const user = this.props.users.find(
      (user) => user.firstName === ev.target.value
    );
    this.setState({ selectedUser: user });
  }

  handleCreate(ev) {
    ev.preventDefault();
    const output = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    };
    this.props.genericPost('users', output);
    this.setState({
      firstName: '',
      lastName: '',
    });
  }

  handleUpdate(ev) {
    ev.preventDefault();
    const { firstName, lastName, selectedUser } = this.state;
    const newInfo = {};
    if (firstName.length) newInfo['firstName'] = firstName;
    if (lastName.length) newInfo['lastName'] = lastName;

    this.props.genericPut('users', { id: selectedUser.id }, newInfo);
    this.setState({
      firstName: '',
      lastName: '',
    });
    this.setState({ selectedUser: this.props.users[0] });
  }

  render() {
    // console.log(this.state, this.props);
    const { users } = this.props;
    return (
      <div>
        <h1>Press F12</h1>
        <p>create user</p>
        <form>
          <input
            name="firstName"
            value={this.state.firstName}
            placeholder="firstName"
            onChange={this.handleOnChange}
          ></input>
          <input
            name="lastName"
            value={this.state.lastName}
            placeholder="lastName"
            onChange={this.handleOnChange}
          ></input>
          <button onClick={this.handleCreate}>submit</button>
        </form>
        <p>update user</p>
        <select
          name="selectedUser"
          value={this.state.selectedUser}
          onChange={this.handleSelect}
        >
          {users.length
            ? users.map((user) => {
                return <option key={user.id}>{user.firstName}</option>;
              })
            : ''}
        </select>

        <form>
          <input
            name="firstName"
            value={this.state.firstName}
            placeholder="firstName"
            onChange={this.handleOnChange}
          ></input>
          <input
            name="lastName"
            value={this.state.lastName}
            placeholder="lastName"
            onChange={this.handleOnChange}
          ></input>
          <button onClick={this.handleUpdate}>update</button>
        </form>
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    genericLoad: (url, slice) => dispatch(GS.genericLoad(url, slice)),
    genericPost: (slice, data) => dispatch(GS.genericPost(slice, data)),
    genericPut: (slice, identifier, data) =>
      dispatch(GS.genericPut(slice, identifier, data)),
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
