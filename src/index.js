import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Test from "./Components/Test/Test";
import TestCRUD from "./Components/Test/TestCRUD";
import QuestionCRUD from "./Components/Question/QuestionCRUD";
import QuestionTypeCRUD from "./Components/QuestionType/QuestionTypeCRUD";
import Layout from "./Components/Layout/Layout";
import Register from "./Components/Register/Register";
import LogIn from "./Components/LogIn/LogIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Carousel } from "antd";
const contentStyle1 = {
  height: "600px",
  color: "#fff",
  lineHeight: "80%",
  textAlign: "center",
  backgroundImage: `url("https://big-i.ru/upload/iblock/a0c/z3ge61wxlhrb2mb0vcq32t2by6jw2gz2.jpg")`,
  backgroundSize: "cover",
};
const contentStyle2 = {
  height: "600px",
  color: "#fff",
  lineHeight: "80%",
  textAlign: "center",
  backgroundImage: `url("https://hi-news.ru/wp-content/uploads/2017/11/questions-750x460.jpg")`,
  backgroundSize: "cover",
};
const contentStyle3 = {
  height: "600px",
  color: "#fff",
  lineHeight: "80%",
  textAlign: "center",
  backgroundImage: `url("https://www.ckrs.ru/images/statyi_prodazi_voprosi_pokupatelyu.jpg")`,
  backgroundSize: "cover",
};
const contentStyle4 = {
  height: "600px",
  color: "#fff",
  lineHeight: "80%",
  textAlign: "center",
  backgroundImage: `url("https://epilepsyinfo.ru/about/faq/faq.jpg")`,
  backgroundSize: "cover",
};

/**
 * Класс, запускающийся с открытием страницы, содержит стейты для сущностей и роуты
 * @returns
 */
const App = () => {
  const [tests, setTests] = useState([]);
  const addTest = (test) => setTests([...tests, test]);
  const removeTest = (removeId) =>
    setTests(tests.filter(({ testId }) => testId !== removeId));

  const [questionTypes, setQuestionTypes] = useState([]);
  const addQuestionType = (questionType) =>
    setQuestionTypes([...questionTypes, questionType]);
  const removeQuestionType = (removeId) =>
    setQuestionTypes(
      questionTypes.filter(({ questionTypeId }) => questionTypeId !== removeId)
    );

  const [questions, setQuestions] = useState([]);
  const addQuestion = (question) => setQuestions([...questions, question]);
  const removeQuestion = (removeId) =>
    setQuestions(questions.filter(({ questionId }) => questionId !== removeId));

  const [user, setUser] = useState({
    isAuthenticated: false,
    userName: "",
    userRole: "",
  });

  /**
   * Получить информацию об авторизированном пользователе (проверка на авторизацию)
   * @returns
   */
  useEffect(() => {
    const getUser = async () => {
      return await fetch("api/account/isauthenticated")
        .then((response) => {
          response.status === 401 &&
            setUser({ isAuthenticated: false, userName: "", userRole: "" });
          return response.json();
        })
        .then(
          (data) => {
            if (
              typeof data !== "undefined" &&
              typeof data.userName !== "undefined" &&
              typeof data.userRole !== "undefined"
            ) {
              setUser({
                isAuthenticated: true,
                userName: data.userName,
                userRole: data.userRole,
              });
            }
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getUser();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route
            index
            element={
              <>
                <h3>Main page</h3>

                <Carousel autoplay>
                  <div>
                    <h3 style={contentStyle1}>1</h3>
                  </div>
                  <div>
                    <h3 style={contentStyle2}>2</h3>
                  </div>
                  <div>
                    <h3 style={contentStyle3}>3</h3>
                  </div>
                  <div>
                    <h3 style={contentStyle4}>4</h3>
                  </div>
                </Carousel>
              </>
            }
          />
          <Route
            path="/testsView"
            element={
              <Test
                user={user}
                tests={tests}
                setTests={setTests}
                removeTest={removeTest}
              />
            }
          />
          <Route
            path="/tests"
            element={
              <TestCRUD
                user={user}
                tests={tests}
                setTests={setTests}
                removeTest={removeTest}
                addTest={addTest}
              />
            }
          />
          <Route
            path="/questions"
            element={
              <QuestionCRUD
                user={user}
                tests={tests}
                questions={questions}
                questionTypes={questionTypes}
                setQuestions={setQuestions}
                removeQuestion={removeQuestion}
                addQuestion={addQuestion}
              />
            }
          />
          <Route
            path="/questionTypes"
            element={
              <QuestionTypeCRUD
                user={user}
                questionTypes={questionTypes}
                setQuestionTypes={setQuestionTypes}
                removeQuestionType={removeQuestionType}
                addQuestionType={addQuestionType}
              />
            }
          />
          <Route
            path="/register"
            element={<Register user={user} setUser={setUser} />}
          />
          <Route
            path="/login"
            element={<LogIn user={user} setUser={setUser} />}
          />
          <Route path="*" element={<h3>404</h3>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);
