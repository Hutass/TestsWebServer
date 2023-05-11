import {
  Form,
  Select,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Input,
} from "antd";
import React, { useState, useEffect } from "react";
import "./QuestionCRUD.css";
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

/**
 * Компонент, отвечающий за область работы с вопросами
 * @param {useStates} states геттер и сеттер для передачи аутентифицированнного пользователя,
 * геттер и сеттер для передачи тестов,
 * геттер и сеттер для передачи вопросов,
 * геттер и сеттер для передачи типов вопросов,
 * стрелочные функции для удаления и добавления вопросов
 * @returns
 */
const App = ({
  user,
  tests,
  questions,
  questionTypes,
  setQuestions,
  removeQuestion,
  addQuestion,
}) => {
  useEffect(() => {
    /**
     * Получить массив вопросов из базы данных
     * @returns
     */
    const getAllQuestions = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/Question/list", requestOptions)
        .then((Response) => Response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setQuestions(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getAllQuestions();
  }, [setQuestions]);

  /**
   * Удаление вопроса из базы данных
   * @param {int} id ключ удаляемого вопроса
   * @returns
   */
  const deleteItem = async (id) => {
    const requestOptions = {
      method: "DELETE",
    };
    return await fetch(
      "api/Question/" + new URLSearchParams({ id }).toString(),
      requestOptions
    ).then(
      (Response) => {
        if (Response.ok) {
          removeQuestion(id);
          const newData = data.filter((item) => item.key !== id);
          setData(newData);
          setEditingKey("");
        }
      },
      (error) => console.log(error)
    );
  };

  const [inputText, setInputText] = useState("");
  const [inputTest, setInputTest] = useState("");
  const [inputType, setInputType] = useState("");

  /**
   * Вызывается при изменении текста в строке ввода
   * @param {Input} e строка текстового ввода
   */
  const handleText = (e) => {
    setInputText(e.target.value);
  };

  /**
   * Вызывается при нажатии на кнопку добавления вопроса, добавляет вопрос в базу данных
   */
  const handleSubmit = () => {
    const question = { testId: inputTest, typeId: inputType, text: inputText };

    const createQuestion = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      };
      const response = await fetch("api/Question", requestOptions);
      return await response.json().then(
        (data) => {
          console.log(data);
          if (response.ok) {
            addQuestion(data);
            setInputText("");
            const newData = originData;
            newData.push({
              key: `${data.id}`,
              id: data.id,
              testId: data.testId,
              typeId: data.typeId,
              text: `${data.text}`,
            });
            setData(newData);
          }
        },
        (error) => console.log(error)
      );
    };
    createQuestion();
  };

  /**
   * Изменение вопроса в базе данных
   * @param {int} id ключ изменяемого вопроса
   * @returns
   */
  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
        const question = {
          id: newData[index].id,
          testId: newData[index].testId,
          typeId: newData[index].typeId,
          text: newData[index].text,
        };
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(question),
        };
        const response = await fetch(
          "api/Question/" + new URLSearchParams({ id }).toString(),
          requestOptions
        );
        return await response.json().then(
          (data) => {
            console.log(data);
          },
          (error) => console.log(error)
        );
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  let originData = [];
  questions.map(({ id, testId, typeId, text }) =>
    originData.push({
      key: `${id}`,
      id: id,
      testId: testId,
      typeId: typeId,
      text: `${text}`,
    })
  );

  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      id: "",
      testId: "",
      typeId: "",
      text: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
      editable: false,
    },
    {
      title: "Test ID",
      dataIndex: "testId",
      width: "10%",
      editable: true,
    },
    {
      title: "Type ID",
      dataIndex: "typeId",
      width: "10%",
      editable: true,
    },
    {
      title: "Text",
      dataIndex: "text",
      width: "55%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {user.isAuthenticated &&
            (user.userRole == "admin" || user.userRole == "moderator") ? (
              <Typography.Link
                onClick={() => save(record.key)}
                style={{
                  marginRight: 8,
                }}
              >
                Save
              </Typography.Link>
            ) : (
              ""
            )}
            {user.isAuthenticated && user.userRole == "admin" ? (
              <Typography.Link
                onClick={() => deleteItem(record.key)}
                style={{
                  marginRight: 8,
                }}
              >
                Delete
              </Typography.Link>
            ) : (
              ""
            )}
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "key" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <h1>Add new question</h1>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Test"
          tooltip="You should choose a test for your question"
        >
          <Select onChange={setInputTest}>
            {tests.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Type of question"
          tooltip="You should choose a type of your question"
        >
          <Select onChange={setInputType}>
            {questionTypes.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Text of question"
          tooltip="You should have a text for your question"
        >
          <Input
            onChange={handleText}
            value={inputText}
            type="text"
            name="text"
            placeholder="How many questions are there?"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Add question
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default App;
