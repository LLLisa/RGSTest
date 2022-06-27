import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../store';
import ClassComp from './ClassComp';


class Root extends React.Component {
  render() {
    return <ClassComp />;
  }
}

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <Root />
  </Provider>
);
