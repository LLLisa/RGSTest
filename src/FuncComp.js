import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import useInput from './useInput';
import { GS } from '../store';
import Update from './Update';

const apiRoute = '/api';

function funcComp() {
  const dispatch = useDispatch();
  const firstName = useInput('');
  const lastName = useInput('');

  useEffect(
    () =>
      GS.models.forEach((model) => {
        dispatch(GS.genericGet(apiRoute, model));
      }),
    []
  );

  function handleSubmit(ev) {
    ev.preventDefault();
    dispatch(
      GS.genericPost(apiRoute, 'users', {
        firstName: firstName.value,
        lastName: lastName.value,
      })
    );
    firstName.setValue('');
    lastName.setValue('');
  }

  return (
    <div>
      <hr />
      <h2>with React hooks:</h2>
      <p>create user</p>

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
      <Update apiRoute={apiRoute} />
    </div>
  );
}

export default connect()(funcComp);
