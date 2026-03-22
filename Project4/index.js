const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const dynamoDB = require("./config");

const app = express();
app.use(bodyParser.json());

const TABLE_NAME = "users";


// ✅ Create User
app.post("/user", async (req, res) => {
  const { name, email } = req.body;

  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: uuidv4(),
      name,
      email,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});


// ✅ Get All Users
app.get("/users", async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    res.status(500).send(error);
  }
});


// ✅ Get Single User
app.get("/user/:id", async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: req.params.id,
    },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    res.json(data.Item);
  } catch (error) {
    res.status(500).send(error);
  }
});


// ✅ Update User
app.put("/user/:id", async (req, res) => {
  const { name, email } = req.body;

  const params = {
    TableName: TABLE_NAME,
    Key: { id: req.params.id },
    UpdateExpression: "set #name = :name, email = :email",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":email": email,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await dynamoDB.update(params).promise();
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});


// ✅ Delete User
app.delete("/user/:id", async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: req.params.id,
    },
  };

  try {
    await dynamoDB.delete(params).promise();
    res.send("User deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});