import { useRef } from "react";
import { useDispatch , useSelector } from "react-redux";
import { counterActions } from "../store/counter";
import { privacyActions } from "../store/privacy";

const Controls = () => {
  const dispatch = useDispatch();
  const privacy = useSelector(store => store.privacy);
  const input = useRef();

  const handleIncrement = () => {
    dispatch(counterActions.increment());
  };

  const handleDecrement = () => {
    dispatch(counterActions.decrement());
  };

  const handlePlus = () => {
    dispatch(counterActions.plus( input.current.value ));
    input.current.value = "";
  };

  const handleMinus = () => {
    dispatch(counterActions.minus( input.current.value ));
    input.current.value = "";
  };

  const handlePrivacyToggle = () => {
    dispatch(privacyActions.privacyToggle());
  };

  return (
    <>
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <button
          type="button"
          className="btn btn-success btn-lg px-4 gap-3"
          onClick={handleIncrement}
        >
          Increment
        </button>
        <button
          type="button"
          className="btn btn-danger btn-lg px-4"
          onClick={handleDecrement}
        >
          Decrement
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg px-4"
          onClick={handlePrivacyToggle}
        >
          {privacy ? "Public" : "Private"}
        </button>
      </div>
      <div
        className="d-grid gap-2 d-sm-flex justify-content-sm-center"
        style={{ marginTop: "20px" }}
      >
        <input
          type="number"
          placeholder="Enter Number"
          ref={input}
          className="btn btn-lg px-4 gap-3"
          style={{ border: "1px solid", width: "200px" }}
        ></input>
        <button
          type="button"
          className="btn btn-success btn-lg px-4"
          onClick={handlePlus}
        >
          Plus
        </button>
        <button
          type="button"
          className="btn btn-danger btn-lg px-4"
          onClick={handleMinus}
        >
          Minus
        </button>
      </div>
    </>
  );
};

export default Controls;
