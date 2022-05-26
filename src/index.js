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
      firstNamePost: '',
      lastNamePost: '',
      firstNamePut: '',
      lastNamePut: '',
      selectedUser: {},
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    GS.models.forEach((model) => {
      this.props.genericLoad('/api', model);
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
      (user) => `${user.firstName} ${user.lastName}` === ev.target.value
    );
    this.setState({ selectedUser: user });
  }

  handleCreate(ev) {
    ev.preventDefault();
    const output = {
      firstName: this.state.firstNamePost,
      lastName: this.state.lastNamePost,
    };
    this.props.genericPost('/api', 'users', output);
    this.setState({
      firstNamePost: '',
      lastNamePost: '',
    });
  }

  //either pass an updated object as 'data' or provide a separate identifier object
  /*{id:selectedUser.id} *or* {email: '123@fakemail.com'} */
  handleUpdate(ev) {
    ev.preventDefault();
    const { firstNamePut, lastNamePut, selectedUser } = this.state;
    const newInfo = {};
    if (firstNamePut.length) newInfo['firstName'] = firstNamePut;
    if (lastNamePut.length) newInfo['lastName'] = lastNamePut;
    console.log('>>>', selectedUser, newInfo);
    this.props.genericPut(
      '/api',
      'users',
      { ...selectedUser, ...newInfo }
      // , { id: selectedUser.id }
    );
    this.setState({
      firstNamePut: '',
      lastNamePut: '',
    });
    // this.setState({ selectedUser: this.props.users[0] });
  }

  handleDelete() {
    console.log('click');
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
            name="firstNamePost"
            value={this.state.firstNamePost}
            placeholder="firstName"
            onChange={this.handleOnChange}
          ></input>
          <input
            name="lastNamePost"
            value={this.state.lastNamePost}
            placeholder="lastName"
            onChange={this.handleOnChange}
          ></input>
          <button onClick={this.handleCreate}>submit</button>
        </form>
        <p>update or delete user</p>
        <select
          name="selectedUser"
          // value={this.state.selectedUser}
          onChange={this.handleSelect}
        >
          {users.length
            ? users.map((user) => {
                return (
                  <option key={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                );
              })
            : ''}
        </select>
        <button onClick={this.handleDelete}>delete</button>
        <form>
          <input
            name="firstNamePut"
            value={this.state.firstNamePut}
            placeholder="firstName"
            onChange={this.handleOnChange}
          ></input>
          <input
            name="lastNamePut"
            value={this.state.lastNamePut}
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
    genericPost: (url, slice, data) =>
      dispatch(GS.genericPost(url, slice, data)),
    genericPut: (url, slice, data, identifier) =>
      dispatch(GS.genericPut(url, slice, data, identifier)),
    genericDelete: (url, slice, identifier) =>
      dispatch(GS.genericDelete(url, slice, identifier)),
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
