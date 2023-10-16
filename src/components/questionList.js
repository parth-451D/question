import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faEye,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const QuestionList = () => {
  const [questionList, setQuestionList] = useState([]);
  const [isOptions, setIsOptions] = useState(false);
  const [questionOptions, setQuestionOptions] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
    setIsOptions(false);
  };

  const [editopen, setEditOpen] = useState(false);

  const onEditOpenModal = () => setEditOpen(true);
  const onCloseEditModal = () => setEditOpen(false);

  const [selectedValue, setSelectedValue] = useState(""); // State for the selected dropdown value

  // Function to handle the dropdown value change
  const handleDropdownChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const getQuestionListData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/questions");
      setQuestionList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [myData, setMyData] = useState({
    questionName: "",
    questionType: "",
    questionOptions: [""],
    questionAnswer: "",
    questionRequirement: true,
    questionSequence: "",
  });

  const createQuestion = async (values) => {
    try {
      const res = await axios.post("http://localhost:8000/questions", values);
      if (res.data) {
        setOpen(false);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      getQuestionListData();
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error.code);
    }
  };

  const validationSchema = (optionType) => {
    return Yup.object().shape({
      questionName: Yup.string().required("Question is required"),
      questionType: Yup.string().required("Question type is required"),
      questionSequence: Yup.number()
        .required("Question sequence is required")
        .positive()
        .integer(),
      questionOptions: optionType
        ? Yup.array()
            .of(Yup.string())
            .test(
              "at-least-one-option",
              "At least one option is required",
              function (value) {
                // Check if value is an array and at least one option is non-empty
                return (
                  Array.isArray(value) &&
                  value.some((option) => option && option.trim() !== "")
                );
              }
            )
        : Yup.array().of(Yup.string()),
    });
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `http://localhost:8000/questions/${_id}`
          );
          if (res.data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Your work has been saved",
              showConfirmButton: false,
              timer: 1500,
            });
          }
          getQuestionListData();
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const [editData, setEditData] = useState({});

  const onedit = (data) => {
    setEditData(data);
    setEditOpen(true);
  };

  const updateQuestion = async (data) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/questions/${data._id}`,
        data
      );

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Question Updated Succesfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setEditOpen(false);
      getQuestionListData();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getQuestionListData();
  }, []);
  return (
    <>
      <div className="container mt-3 ">
        <div>
          <button onClick={onOpenModal} className="btn btn-primary">
            Add Question
          </button>
          <select
            value={selectedValue}
            onChange={handleDropdownChange}
            className="mx-3"
          >
            <option value="">Select All</option>
            <option value="Text">Text</option>
            <option value="Textarea">Textarea</option>
            <option value="Checkbox">Checkbox</option>
            <option value="Date">Date</option>
            <option value="Radio">Radio Button</option>
            <option value="File">Upload file</option>
          </select>
          <Modal open={open} onClose={onCloseModal} center>
            <h2>Add Question</h2>
            <Formik
              initialValues={myData}
              validationSchema={validationSchema(isOptions)}
              onSubmit={(values) => {
                createQuestion(values);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                /* and other goodies */
              }) => (
                <form>
                  {console.log(errors, "error")}
                  <div class="form-group">
                    <label className="mb-1">Question</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Enter question"
                      name="questionName"
                      value={values.questionName}
                      onChange={handleChange}
                    />
                    {touched.questionName && errors.questionName && (
                      <div className="text-danger">{errors.questionName}</div>
                    )}
                  </div>

                  <div class="form-group mt-3">
                    <div class="custom-select">
                      <select
                        name=""
                        onChange={(e) => {
                          setIsOptions(false);
                          setQuestionOptions("");
                          setFieldValue("questionType", e.target.value);
                          if (
                            e.target.value === "Radio" ||
                            e.target.value === "Checkbox"
                          ) {
                            setIsOptions(true);
                          }
                        }}
                      >
                        <option value="" selected>
                          Select an option
                        </option>
                        <option value="Text">Text</option>
                        <option value="Textarea">Textarea</option>
                        <option value="Checkbox">Checkbox</option>
                        <option value="Date">Date</option>
                        <option value="Radio">Radio Button</option>
                        <option value="File">Upload file</option>
                      </select>
                    </div>
                    {touched.questionType && errors.questionType && (
                      <div className="text-danger">{errors.questionType}</div>
                    )}
                  </div>

                  {isOptions && (
                    <FieldArray name="questionOptions">
                      {({ push, remove }) => (
                        <>
                          {values.questionOptions.map((option, index) => (
                            <div key={index} className="d-flex">
                              <Field
                                type="text"
                                name={`questionOptions[${index}]`}
                                className="form-control mt-2"
                                placeholder="Enter Option"
                              />
                              {index === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => push("")}
                                  className="plus-icon mt-2"
                                >
                                  <FontAwesomeIcon icon={faPlus} />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="minus-icon mt-2"
                                >
                                  <FontAwesomeIcon icon={faMinus} />
                                </button>
                              )}
                            </div>
                          ))}
                          {touched.questionOptions &&
                            errors.questionOptions && (
                              <div className="text-danger">
                                {errors.questionOptions}
                              </div>
                            )}
                        </>
                      )}
                    </FieldArray>
                  )}

                  <label className="mt-2">Requirement</label>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="questionRequirement"
                      value="true" // Set the value to "true" for "Yes"
                      onChange={() =>
                        setFieldValue("questionRequirement", true)
                      }
                      id="flexRadioDefault1"
                      checked={values.questionRequirement === true}
                    />
                    <label class="form-check-label" for="flexRadioDefault1">
                      Yes
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="questionRequirement"
                      value="false" // Set the value to "false" for "No"
                      onChange={() =>
                        setFieldValue("questionRequirement", false)
                      }
                      id="flexRadioDefault2"
                      checked={values.questionRequirement === false}
                    />
                    <label class="form-check-label" for="flexRadioDefault2">
                      No
                    </label>
                  </div>

                  <div class="form-group mt-2">
                    <label className="mb-1">Question Sequence</label>
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Enter question Sequence"
                      name="questionSequence"
                      value={values.questionSequence}
                      onChange={handleChange}
                    />
                    {touched.questionSequence && errors.questionSequence && (
                      <div className="text-danger">
                        {errors.questionSequence}
                      </div>
                    )}
                    {error == 11000 && (
                      <div className="text-danger">
                        Duplicate Sequesnce Number
                      </div>
                    )}
                  </div>

                  <div className="text-cenetr mt-4">
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Add Question
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </Modal>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th scope="col">Question Sequence</th>
              <th scope="col">Question</th>
              <th scope="col">Question Type</th>
              <th scope="col">Question Requirement</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {console.log(questionList, "questionList")}
            {questionList
              .filter((data) =>
                selectedValue === ""
                  ? true
                  : data.questionType === selectedValue
              )
              .map((data, index) => (
                <tr key={index}>
                  <td>{data.questionSequence}</td>
                  <td>{data.questionName}</td>
                  <td>{data.questionType}</td>
                  <td>{data.questionRequirement ? "Yes" : "No"}</td>
                  <td className="d-flex">
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDelete(data._id)}
                    />
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => onedit(data)}
                      className="mx-2"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Modal open={editopen} onClose={onCloseEditModal} center>
          <h2>Add Question</h2>
          <Formik
            initialValues={editData}
            validationSchema={validationSchema(isOptions)}
            onSubmit={(values) => {
              updateQuestion(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              /* and other goodies */
            }) => (
              <form>
                <div class="form-group">
                  <label className="mb-1">Question</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter question"
                    name="questionName"
                    value={values.questionName}
                    onChange={handleChange}
                  />
                  {touched.questionName && errors.questionName && (
                    <div className="text-danger">{errors.questionName}</div>
                  )}
                </div>

                <div class="form-group mt-3">
                  <div class="custom-select">
                    <select
                      name=""
                      onChange={(e) => {
                        setIsOptions(false);
                        setQuestionOptions("");
                        setFieldValue("questionType", e.target.value);
                        if (
                          e.target.value === "Radio" ||
                          e.target.value === "Checkbox"
                        ) {
                          setIsOptions(true);
                        }
                      }}
                    >
                      <option value="" selected>
                        Select an option
                      </option>
                      <option value="Text">Text</option>
                      <option value="Textarea">Textarea</option>
                      <option value="Checkbox">Checkbox</option>
                      <option value="Date">Date</option>
                      <option value="Radio">Radio Button</option>
                      <option value="File">Upload file</option>
                    </select>
                  </div>
                  {touched.questionType && errors.questionType && (
                    <div className="text-danger">{errors.questionType}</div>
                  )}
                </div>

                {isOptions && (
                  <FieldArray name="questionOptions">
                    {({ push, remove }) => (
                      <>
                        {values.questionOptions.map((option, index) => (
                          <div key={index} className="d-flex">
                            <Field
                              type="text"
                              name={`questionOptions[${index}]`}
                              className="form-control mt-2"
                              placeholder="Enter Option "
                            />
                            {index === 0 ? (
                              <button
                                type="button"
                                onClick={() => push("")}
                                className="plus-icon mt-2"
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="minus-icon mt-2"
                              >
                                <FontAwesomeIcon icon={faMinus} />
                              </button>
                            )}
                          </div>
                        ))}
                        {touched.questionOptions && errors.questionOptions && (
                          <div className="text-danger">
                            {errors.questionOptions}
                          </div>
                        )}
                      </>
                    )}
                  </FieldArray>
                )}

                <label className="mt-2">Requirement</label>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="questionRequirement"
                    value="true" // Set the value to "true" for "Yes"
                    onChange={() => setFieldValue("questionRequirement", true)}
                    id="flexRadioDefault1"
                    checked={values.questionRequirement === true}
                  />
                  <label class="form-check-label" for="flexRadioDefault1">
                    Yes
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="questionRequirement"
                    value="false" // Set the value to "false" for "No"
                    onChange={() => setFieldValue("questionRequirement", false)}
                    id="flexRadioDefault2"
                    checked={values.questionRequirement === false}
                  />
                  <label class="form-check-label" for="flexRadioDefault2">
                    No
                  </label>
                </div>

                <div class="form-group mt-2">
                  <label className="mb-1">Question Sequence</label>
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Enter question Sequence"
                    name="questionSequence"
                    value={values.questionSequence}
                    onChange={handleChange}
                  />
                  {touched.questionSequence && errors.questionSequence && (
                    <div className="text-danger">{errors.questionSequence}</div>
                  )}
                </div>

                <div className="text-cenetr mt-4">
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Update Question
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </Modal>
      </div>
    </>
  );
};

export default QuestionList;
