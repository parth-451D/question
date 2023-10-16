import axios from "axios";
import React, { useEffect, useState } from "react";
import Checkbox from "./common/Checkbox";

const PaperPage = () => {
  const [questionList, setQuestionList] = useState([]);
  const getQuestionListData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/questions");
      setQuestionList(res.data);
      console.log("gsddssgdgss", res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getQuestionListData();
  }, []);
  return (
    <div>
      {questionList &&
        questionList.map((ele, idx) => {
          if (ele.questionType === "Checkbox") {
            console.log("2");
            return <Checkbox optionList={ele.questionOptions} key={idx} />;
          }
          return null; // Make sure to return something from map
        })}
    </div>
  );
};

export default PaperPage;
