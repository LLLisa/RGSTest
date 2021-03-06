import React, { useEffect, useReducer } from 'react';
import { connect, useDispatch } from 'react-redux';
import useInput from './useInput';
import { GS } from '../store';
import UpdateUser from './UpdateUser';

//the model route was left as a string in this version to demonstrate flexibility
const apiRoute = '/api';

function funcComp() {
  const dispatch = useDispatch();
  const firstName = useInput('');
  const lastName = useInput('');

  //you can use the GS.generateReducer method with the useReducer hook...

  //   const [names, dispatch] = useReducer(GS.generateReducer('names'), [
  //     'Bart',
  //     'Lisa',
  //   ]);

  //   useEffect(() => {
  //     dispatch({ type: 'POST_names', payload: 'Maggie' });
  //   }, []);

  //(note the GS naming convention: 'POST_names')
  //...but the GS object automatically builds a reducer for each model when it
  //is created. Therefore, you should use the useReducer hook only for new
  //pieces of state that were not declared when the GS object is created.

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
        <button disabled={!firstName.value.length || !lastName.value.length}>
          submit
        </button>
      </form>
      {/*apiRoute is passed as a prop here, but it could be passed using useContext if preferred*/}
      <UpdateUser apiRoute={apiRoute} />
    </div>
  );
}

export default connect()(funcComp);
