"use client";

import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "../lib/store";
import { PersistGate } from "redux-persist/integration/react";

const Providers = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
);

export default Providers;
