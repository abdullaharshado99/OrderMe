import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigation from './src/navigation';
import { persistedStore, store } from '@redux/store';
import AppLoader from '@components/AppLoader/Apploader';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistedStore}
        loading={<AppLoader visible message="Loading..." />}
      >
        <AppNavigation />
      </PersistGate>
    </Provider>
  );
};

export default App;
