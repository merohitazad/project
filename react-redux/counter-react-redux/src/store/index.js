import { createStore } from "redux";

const INITIAL_VALUE = {
  counter: 0,
  privacy: false,
};

const counterReducer = (store = INITIAL_VALUE, action) => {
  if (action.type === "increment") {
    return { ...store, counter: store.counter + 1 };
    // { counter: store.counter + 1, privacy: store.privacy };
  } else if (action.type === "decrement") {
    return { ...store, counter: store.counter - 1 };
    // { counter: store.counter - 1, privacy: store.privacy };
  } else if (action.type === "plus") {
    return {
      counter: store.counter + Number(action.payload),
      privacy: store.privacy,
    };
  } else if (action.type === "minus") {
    return {
      counter: store.counter - Number(action.payload),
      privacy: store.privacy,
    };
  } else if (action.type === "privacyToggle") {
    return { counter: store.counter, privacy: !store.privacy };
  } else return store;
};

const counterStore = createStore(counterReducer);

export default counterStore;
