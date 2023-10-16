import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const Checkbox = (props) => {
  const [answer, setAnswer] = useState();
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
              checked={answer.includes(shuffledOptions[idx])}
              onChange={(event) => handleChange(event, idx)}
            />
          );
        })}
    </div>
  );
};

export default Checkbox;
