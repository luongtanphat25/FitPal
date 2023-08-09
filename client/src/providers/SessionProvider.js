import {createContext, useState, } from 'react';
// Create a Context
export const sessionContext = createContext();

// Create a Component wrapper from Context.Provider
export default function SessionProvider(props) {
  const [sessions, setSessions] = useState([]);
  // Here is our Shared State Object


  // This list can get long with a lot of functions.  Reducer may be a better choice
  const providerData = { };

  // We can now use this as a component to wrap anything
  // that needs our state
  return (
    <sessionContext.Provider value={providerData}>
      {props.children}
    </sessionContext.Provider>
  );
};