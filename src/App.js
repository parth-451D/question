import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import QuestionList from "./components/questionList";
import PaperPage from "./components/PaperPage";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<QuestionList/>} />
            <Route path="/questionList" element={<QuestionList/>} />
            <Route path="/paper" element={<PaperPage/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
