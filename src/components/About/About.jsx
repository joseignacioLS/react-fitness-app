import React from "react";
import "./About.scss";
import { useNavigate } from "react-router-dom";
import DefaultButton from "../../shared/DefaultButton/DefaultButton";
import { ArrowFatLeft } from "phosphor-react";
import { useState } from "react";
import Slider from "../../shared/Slider/Slider";
import { useContext } from "react";
import { UserOptionsContext } from "../../core/contexts/userOptionsContext";

const faq = [
  {
    q: "About this project",
    a: (
      <>
        This is a personal project developed by Jose I. Labella. You can check
        my projects on{" "}
        <a href="https://github.com/joseignacioLS/">my github page</a>
      </>
    ),
  },
  {
    q: "How to use this app",
    a: (
      <>
        You can easily add exercises and control for how long/how many times you
        want to repeat those exercises.
        <br />
        <br />
        Use blocks to group together exercises and set how many times you want
        to repeat that group.
        <br />
        <br />
        Click on the name of your exercises/blocks to edit/delete them.
        <br />
        <br />
        Change between your routines with the arrows to generate new ones. Do
        not worry, routines are not removed (unless they are empty).
        <br />
        <br />
        When you are ready hit play! The routine will start running, pause it or
        stop it whenever you want!
      </>
    ),
  },
  {
    q: "Contact",
    a: "I am open to collaborate, just send me an email to ls.joseignacio(gmail.com)",
  },
];

const About = () => {
  const [selectedQ, setSelectedQ] = useState(undefined);
  const { userOptions, userOptionsDispatcher } = useContext(UserOptionsContext);
  const navigate = useNavigate();
  return (
    <div className="about">
      <DefaultButton
        content={<ArrowFatLeft size={"100%"} />}
        onClickFunction={() => {
          navigate("/");
        }}
      />
      <p className="about__title">OPTIONS</p>
      <div className="user-options">
        <p>Sound</p>
        <Slider
          handleClick={() => {
            userOptionsDispatcher({
              type:"modify",
              payload: {
                sound: !userOptions.sound
              }
            })
          }}
          onCriterium={userOptions.sound}
          rightContent={"on"}
          leftContent={"off"}
          colorOn={"grey"}
        ></Slider>
      </div>
      <p className="about__title">ABOUT</p>
      <ul className="faq">
        {faq.map(({ q, a }, i) => {
          return (
            <li
              className="faq__item"
              key={q}
              onClick={() => {
                selectedQ === i ? setSelectedQ(undefined) : setSelectedQ(i);
              }}
            >
              <p className="question">{q}</p>
              {selectedQ === i && <p className="answer">{a}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default About;
