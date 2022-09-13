import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../contexts/modalContext";
import "./Modal.scss";
import { CheckCircle } from "phosphor-react";

const Modal = () => {
  const { modalData, modalDispatcher } = useContext(ModalContext);

  const handleClick = (e) => {
    modalDispatcher({
      type: "action",
    });
  };

  const [countdown, setCountdown] = useState({
    cb: () => {},
    current: undefined,
    time: undefined,
    interval: null,
  });

  useEffect(() => {
    if (!modalData.countdown) return;
    if (modalData.countdown.time <= 0) return;
    setCountdown(() => {
      const interval = setInterval(() => {
        setCountdown((oldValue) => {
          const newValue = oldValue.current - 100;
          return {
            ...oldValue,
            current: oldValue.current - 100,
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

  useEffect(() => {
    if (countdown.current <= 0) {
      clearInterval(countdown.interval);
      countdown.cb();
      handleClick();
    }
  }, [countdown.current]);

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
            <button onClick={handleClick}>
              <CheckCircle size={32} weight="fill" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
