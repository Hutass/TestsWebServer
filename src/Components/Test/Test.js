import React, { useEffect } from "react";
import "./Style.css";

/**
 * Компонент, отвечающий за область отображения тестов и вопросов
 * @param {useStates} test
 * геттер и сеттер для передачи тестов,
 * @returns
 */
const Test = ({ tests, setTests }) => {
  useEffect(() => {
    /**
     * Получить массив тестов из базы данных
     * @returns
     */
    const getAllTests = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/Test/list", requestOptions)
        .then((Response) => Response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setTests(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getAllTests();
  }, [setTests]);

  return (
    <React.Fragment>
      <h1>List of Tests</h1>
      {tests.map(({ id, name, questions }) => (
        <div className="Test" key={id} id={id}>
          <strong>
            {" "}
            {id}:{name}{" "}
          </strong>
          {questions.map(({ questionId, text }) => (
            <div className="TestElement" key={questionId} id={questionId}>
              {text}
            </div>
          ))}
        </div>
      ))}
    </React.Fragment>
  );
};
export default Test;
