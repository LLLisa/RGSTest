import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import useInput from './useInput';
import { GS } from '../store';

function update({ apiRoute, users }) {
  const dispatch = useDispatch();
  const firstName = useInput('');
  const lastName = useInput('');
  const [selectedUser, selectUser] = useState('');

  useEffect(() => {
    selectUser(users[0]);
  }, [users]);

  async function handleSelect(ev) {
    await selectUser(
      users.find(
        (user) => `${user.firstName} ${user.lastName}` === ev.target.value
      )
    );
  }

  function handleSubmit(ev) {
    ev.preventDefault();

    const newInfo = {};
    if (firstName.value.length) newInfo['firstName'] = firstName.value;
    if (lastName.value.length) newInfo['lastName'] = lastName.value;

    dispatch(
      GS.genericPut(apiRoute, 'users', {
        ...selectedUser,
        ...newInfo,
      })
    );
    firstName.setValue('');
    lastName.setValue('');
  }

  function handleDelete() {
    dispatch(GS.genericDelete(apiRoute, 'users', selectedUser));
  }

  return (
    <div>
      <p>update or delete user</p>
      <select onChange={handleSelect}>
        {users.map((user) => {
          return (
            <option key={user.id}>
              {user.firstName} {user.lastName}
            </option>
          );
        })}
      </select>
      <button onClick={handleDelete}>delete</button>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={firstName.value}
          onChange={firstName.onChange}
          placeholder='firstName'
        ></input>
        <input
          type='text'
          value={lastName.value}
          onChange={lastName.onChange}
          placeholder='lastName'
        ></input>
        <button disabled={!firstName.value.length && !lastName.value.length}>
          submit
        </button>
      </form>
    </div>
  );
}

export default connect((state) => state)(update);
