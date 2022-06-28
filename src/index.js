import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../store';
import ClassComp from './ClassComp';
import FuncComp from './FuncComp';

class Root extends React.Component {
  render() {
    return (
      <div>
        <h1>open dev console</h1>
        <ClassComp />
        <FuncComp />
      </div>
    );
  }
}

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <Root />
  </Provider>
);
