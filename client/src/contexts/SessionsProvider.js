import {createContext, useState, } from 'react';
// Create a Context
export const sessionsContext = createContext();

// Create a Component wrapper from Context.Provider
export default function SessionsProvider(props) {
  // Here is our Shared State Object


  // This list can get long with a lot of functions.  Reducer may be a better choice
  const providerData = { };

  // We can now use this as a component to wrap anything
  // that needs our state
  return (
    <sessionsContext.Provider value={providerData}>
      {props.children}
    </sessionsContext.Provider>
  );
};