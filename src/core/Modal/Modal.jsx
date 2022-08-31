import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../contexts/modalContext";
import "./Modal.scss";

const Modal = () => {
  const { modalData, modalDispatcher } = useContext(ModalContext);
  const handleClick = (e) => {
    modalDispatcher({
      type: "action",
    });
  };

  const [countdown, setCountdown] = useState({});

  useEffect(() => {
    if (!modalData.countdown) return;
    if (modalData.countdown.time <= 0) return;
    console.log("making progress")
    setCountdown((oldValue) => {
      const interval = setInterval(() => {
        setCountdown((oldValue) => {
          const newValue = oldValue.current - 100;
          if (newValue > 0) {
            return {
              ...oldValue,
              current: oldValue.current - 100,
            };
          }
          clearInterval(oldValue.interval);
          oldValue.cb();
          handleClick();
          return {
            current: 0,
            time: 0,
            interval: undefined,
            cb: () => {},
          };
        });
      }, 100);
      return {
        cb: modalData.countdown.cb,
        current: modalData.countdown.time,
        time: modalData.countdown.time,
        interval: interval,
      };
    });
  }, [modalData.countdown]);

  return (
    <div className="modal">
      <div className="modal__pop-up">
        {countdown?.time > 0 ? (
          <>
            <p>Starting in...</p>
            <p>{parseInt(countdown.current / 1000)}</p>
          </>
        ) : (
          <>
            <p>{modalData.text}</p>
            <button onClick={handleClick}>👍</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
