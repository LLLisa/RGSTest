import React from 'react';
import { GS } from '../store';
import { connect } from 'react-redux';

//setting strings as constants prevents a lot of bugs
//this can also be done in the constructor if using class components
const apiRoute = '/api';
const usersModel = 'users';

class ClassComp extends React.Component {
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

  //This is what loads all of the data into the redux store.
  //If you wish, you can call genericGet models individually.
  componentDidMount() {
    GS.models.forEach((model) => {
      this.props.genericGet(apiRoute, model);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.users.length !== this.props.users.length) {
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
    const data = {
      firstName: this.state.firstNamePost,
      lastName: this.state.lastNamePost,
    };
    this.props.genericPost(apiRoute, usersModel, data);
    this.setState({
      firstNamePost: '',
      lastNamePost: '',
    });
  }

  //either pass an updated object as 'data' or provide a separate identifier object

  //{id: selectedUser.id} *or* {email: '123@fakeEmail.com'} etc

  //if no identifier object is passed, genericPut will look for an 'id'
  //property on the data object passed and use that as the identifier
  handleUpdate(ev) {
    ev.preventDefault();
    const { firstNamePut, lastNamePut, selectedUser } = this.state;
    const newInfo = {};
    if (firstNamePut.length) newInfo['firstName'] = firstNamePut;
    if (lastNamePut.length) newInfo['lastName'] = lastNamePut;
    this.props.genericPut(
      apiRoute,
      usersModel,
      //as a single data object:
      { ...selectedUser, ...newInfo }

      //or, with a separate identifier:

      //newInfo,
      //{ id: selectedUser.id }
    );
    this.setState({
      firstNamePut: '',
      lastNamePut: '',
    });
    this.setState({ selectedUser: this.props.users[0] });
  }

  handleDelete() {
    this.props.genericDelete(apiRoute, usersModel, {
      id: this.state.selectedUser.id,
    });
  }

  render() {
    // console.log(this.state, this.props);
    const { users } = this.props;
    return (
      <div>
        <hr />
        <h2>in Class Component:</h2>
        <p>create user</p>
        <form>
          <input
            name='firstNamePost'
            value={this.state.firstNamePost}
            placeholder='firstName'
            onChange={this.handleOnChange}
          ></input>
          <input
            name='lastNamePost'
            value={this.state.lastNamePost}
            placeholder='lastName'
            onChange={this.handleOnChange}
          ></input>
          <button
            disabled={!this.state.firstNamePost || !this.state.lastNamePost}
            onClick={this.handleCreate}
          >
            submit
          </button>
        </form>
        <p>update or delete user</p>
        <select name='selectedUser' onChange={this.handleSelect}>
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
            name='firstNamePut'
            value={this.state.firstNamePut}
            placeholder='firstName'
            onChange={this.handleOnChange}
          ></input>
          <input
            name='lastNamePut'
            value={this.state.lastNamePut}
            placeholder='lastName'
            onChange={this.handleOnChange}
          ></input>
          <button
            disabled={!this.state.firstNamePut && !this.state.lastNamePut}
            onClick={this.handleUpdate}
          >
            update
          </button>
        </form>
      </div>
    );
  }
}

//note the extra arguments passed into these methods. This is the trade-off
//for using the general store.
const mapDispatch = (dispatch) => {
  return {
    genericGet: (route, model) => dispatch(GS.genericGet(route, model)),
    genericPost: (route, model, data) =>
      dispatch(GS.genericPost(route, model, data)),
    genericPut: (route, model, data, identifier) =>
      dispatch(GS.genericPut(route, model, data, identifier)),
    genericDelete: (route, model, identifier) =>
      dispatch(GS.genericDelete(route, model, identifier)),
  };
};

export default connect((state) => state, mapDispatch)(ClassComp);
