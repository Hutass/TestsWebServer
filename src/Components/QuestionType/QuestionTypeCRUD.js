import {
  Form,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Input,
} from "antd";
import React, { useState, useEffect } from "react";
import "./QuestionTypeCRUD.css";
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
 * Компонент, отвечающий за область работы с типами вопросов
 * @param {useStates} states геттер и сеттер для передачи аутентифицированнного пользователя,
 * геттер и сеттер для передачи типов вопросов,
 * стрелочные функции для удаления и добавления типов вопросов
 * @returns
 */
const App = ({
  user,
  questionTypes,
  setQuestionTypes,
  removeQuestionType,
  addQuestionType,
}) => {
  useEffect(() => {
    /**
     * Получить массив типов вопросов из базы данных
     * @returns
     */
    const getAllQuestionTypes = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/QuestionType/list", requestOptions)
        .then((Response) => Response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setQuestionTypes(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getAllQuestionTypes();
  }, [setQuestionTypes]);

  /**
   * Удаление типа вопроса из базы данных
   * @param {int} id ключ удаляемого типа вопроса
   * @returns
   */
  const deleteItem = async (id) => {
    const requestOptions = {
      method: "DELETE",
    };
    return await fetch(
      "api/QuestionType/" + new URLSearchParams({ id }).toString(),
      requestOptions
    ).then(
      (Response) => {
        if (Response.ok) {
          removeQuestionType(id);
          const newData = data.filter((item) => item.key !== id);
          setData(newData);
          setEditingKey("");
        }
      },

      (error) => console.log(error)
    );
  };

  const [inputText, setInputText] = useState("");

  /**
   * Вызывается при изменении текста в строке ввода
   * @param {Input} e строка текстового ввода
   */
  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  /**
   * Вызывается при нажатии на кнопку добавления типа вопроса, добавляет тип вопроса в базу данных
   */
  const handleSubmit = () => {
    const questionType = { name: inputText };

    const createQuestionType = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionType),
      };

      const response = await fetch("api/QuestionType", requestOptions);
      return await response.json().then(
        (data) => {
          console.log(data);
          if (response.ok) {
            addQuestionType(data);
            setInputText("");
            const newData = originData;
            newData.push({
              key: `${data.id}`,
              id: data.id,
              name: `${data.name}`,
            });
            setData(newData);
          }
        },
        (error) => console.log(error)
      );
    };
    createQuestionType();
  };

  /**
   * Изменение типа вопроса в базе данных
   * @param {int} id ключ изменяемого типа вопроса
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
        const questionType = {
          id: newData[index].id,
          name: newData[index].name,
        };
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(questionType),
        };
        const response = await fetch(
          "api/QuestionType/" + new URLSearchParams({ id }).toString(),
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

  const originData = [];
  questionTypes.map(({ id, name }) =>
    originData.push({
      key: `${id}`,
      id: id,
      name: `${name}`,
    })
  );

  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      id: "",
      name: "",
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
      width: "15%",
      editable: false,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "75%",
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
        inputType: col.dataIndex === "id" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <h1>Add new question type</h1>
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
          label="Name of question type"
          tooltip="You should have a name for your question type"
        >
          <Input
            onChange={handleChange}
            value={inputText}
            type="text"
            name="name"
            placeholder="Multiple answers"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Add question type
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default App;
