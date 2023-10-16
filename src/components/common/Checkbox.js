import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const Checkbox = (props) => {
  const [answer, setAnswer] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    // Shuffle the options array when it changes
    const shuffled = props.optionList.sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);

    // Load existing answers from localStorage or initialize an empty array
    const storedAnswers = JSON.parse(localStorage.getItem("answerList")) || [];
    setAnswer(storedAnswers);
  }, [props.optionList]);

  const handleCheckChange = (ele, isChecked) => {
    let updatedAnswers = [...answer];

    if (isChecked) {
      updatedAnswers.push(ele);
    } else {
      updatedAnswers = updatedAnswers.filter((item) => item !== ele);
    }

    // Update the answer state
    setAnswer(updatedAnswers);

    // Store the updated array in localStorage
    localStorage.setItem("answerList", JSON.stringify(updatedAnswers));
  };

  return (
    <div>
      {shuffledOptions.map((ele, idx) => {
        const isChecked = answer.includes(ele);

        return (
          <Form.Check
            key={idx}
            type="checkbox"
            id={`checkbox-${idx}`}
            label={ele}
            checked={isChecked}
            onChange={() => handleCheckChange(ele, !isChecked)}
          />
        );
      })}
    </div>
  );
};

export default Checkbox;
