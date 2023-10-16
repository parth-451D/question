import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const Checkbox = (props) => {
  console.log("object");
  const [answer, setAnswer] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    // Shuffle the options array when it changes
    const shuffled = props.optionList.sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);
  }, [props.optionList]);

  const handleChange = (event, index) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the selected option to the answer state
      setAnswer((prevAnswer) => [...prevAnswer, shuffledOptions[index]]);
    } else {
      // Remove the deselected option from the answer state
      setAnswer((prevAnswer) => prevAnswer.filter((item, i) => i !== index));
    }
  };

  const handleCheckChange = (e, ele) => {
    const oldArr = localStorage.getItem("answerList")
    if (answer && answer.includes(ele)) {
      answer.splice(e.target.checked, 1);
    } else {
      answer.push(e.target.checked);
    }
    const index = oldArr?.findIndex((item) => item.id === props._id);
    if (index !== -1) {
        // If the object with the id exists, update the ans property
        oldArr[index].answer = answer;
      } else {
        // If the object with the id doesn't exist, add a new object
        oldArr.push({ id: props._id, answer: answer });
      }
    localStorage.setItem("answerList", oldArr)
  };

  console.log(localStorage.getItem("answerList"))

  return (
    <div>
      {props &&
        props.optionList.map((ele, idx) => {
          return (
            <Form.Check
              key={idx}
              type="checkbox"
              id="checkbox"
              label={ele}
              checked={answer && answer.includes(answer[idx])}
              onChange={(event) => handleCheckChange(event, ele)}
            />
          );
        })}
    </div>
  );
};

export default Checkbox;
