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
import "./TestCRUD.css";
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
 * Компонент, отвечающий за область работы с тестами
 * @param {useStates} states геттер и сеттер для передачи аутентифицированнного пользователя,
 * геттер и сеттер для передачи тестов,
 * стрелочные функции для удаления и добавления тестов
 * @returns
 */
const App = ({ user, tests, setTests, removeTest, addTest }) => {
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

  /**
   * Удаление теста из базы данных
   * @param {int} id ключ удаляемого теста
   * @returns
   */
  const deleteItem = async (id) => {
    const requestOptions = {
      method: "DELETE",
    };
    return await fetch(
      "api/Test/" + new URLSearchParams({ id }).toString(),
      requestOptions
    ).then(
      (Response) => {
        if (Response.ok) {
          removeTest(id);
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
   * Вызывается при нажатии на кнопку добавления теста, добавляет тест в базу данных
   */
  const handleSubmit = () => {
    const test = { name: inputText };

    const createTest = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(test),
      };

      const response = await fetch("api/Test", requestOptions);
      return await response.json().then(
        (data) => {
          console.log(data);
          if (response.ok) {
            addTest(data);
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
    createTest();
  };

  /**
   * Изменение теста в базе данных
   * @param {int} id ключ изменяемого теста
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
        const test = {
          id: newData[index].id,
          name: newData[index].name,
        };
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(test),
        };
        const response = await fetch(
          "api/Test/" + new URLSearchParams({ id }).toString(),
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
  tests.map(({ id, name }) =>
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
      <h1>Add new test</h1>
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
        <Form.Item label="Name of test" tooltip="You need a name for your test">
          <Input
            onChange={handleChange}
            value={inputText}
            type="text"
            name="name"
            placeholder="The very important test"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Add test
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default App;
