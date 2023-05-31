var express = require("express");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var cors = require("cors");
var Article = require("./model/article.js");
var connectDatabase = require("./mongo.js");

var app = express();
app.use(express.json());
app.use(cors());
var User = require("./model/user.js");

const startServer = async () => {
  await connectDatabase();
  app.listen(3000);
};

app.get("/api/articles", authenticateUser, async function (req, res) {
  try {
    var articles = await Article.find({});
    sendResponse(res, 200, articles, null);
  } catch (ex) {
    handleException(res, ex);
  }
});

app.post("/api/users/:userId/articles", authenticateUser, async (req, res) => {
  try {
    if (req.params.userId != req.user.id) {
      sendResponse(res, 401, null, "unauthorized user");
      return;
    }
    const { firstName, lastName, email, age } = req.user;
    var { title, content } = req.body;
    if (!(title && content)) {
      sendResponse(res, 400, null, "title or content is missing");
      return;
    }

    const article = await Article.create({
      authorId: req.user.id,
      Author: {
        firstName,
        lastName,
        email,
        age,
      },
      title,
      content,
    });

    sendResponse(res, 201, { id: article._id }, null);
  } catch (ex) {
    handleException(res, ex);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      sendResponse(res, 400, null, "Email or Password is missing");
      return;
    }
    var user = await User.findOne({ email });
    if (!user) {
      sendResponse(res, 400, null, "User with the given email does not exist");
      return;
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (user && passwordMatched) {
      const token = await jwt.sign(
        {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          age: user.age,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = "Bearer " + token;
      user.password = undefined;
      sendResponse(res, 200, user, null);
      return;
    } else {
      sendResponse(res, 400, null, "wrong password");
      return;
    }
  } catch (ex) {
    handleException(res, ex);
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, age } = req.body;
    if (!(firstName && lastName && email && password && age)) {
      sendResponse(res, 400, null, "Mandatory fields are missing");
      return;
    }
    var presentUser = await User.findOne({ email });
    if (presentUser) {
      sendResponse(res, 400, null, "User with given the email already exists");
      return;
    }
    const encryptedPassword = await bcrypt.hash(password, 2);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      age,
    });
    const token = jwt.sign(
      {
        id: user._id,
        firstName,
        lastName,
        email,
        age,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = "Bearer " + token;
    user.password = undefined;
    sendResponse(res, 201, user, null);
  } catch (ex) {
    handleException(res, ex);
  }
});

app.put("/api/users/:userId", authenticateUser, async (req, res) => {
  try {
    const allowedFields = ["firstName", "lastName", "age", "user"];
    const requestBodyFields = Object.keys(req.body);
    var checkError = false;
    requestBodyFields.forEach((key) => {
      if (!allowedFields.includes(key)) {
        sendResponse(res, 400, null, `${key} is not allowed to update`);
        checkError = true;
        return;
      }
    });
    if (checkError) {
      return;
    }
    const userId = req.params.userId;
    const { firstName, lastName, age } = req.body;

    if (!(userId && (firstName || lastName || age))) {
      sendResponse(res, 400, null, "mandatory fields are missing");
      return;
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      sendResponse(res, 400, null, "No user exists with the given userId");
      return;
    }
    const updatedUser = await User.updateOne({ _id: userId }, req.body);
    sendResponse(res, 200, { status: "User info updated" }, null);
  } catch (ex) {
    handleException(res, ex);
  }
});

function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    sendResponse(res, 400, null, "token is not present");
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    sendResponse(res, 400, null, "Wrong token");
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
    if (error) {
      sendResponse(res, 400, null, "Unauthorized user");
      return;
    }
    req.user = user;
    next();
  });
}

const sendResponse = (res, statusCode, data, error) => {
  res.status(statusCode).send({ data, error });
};

const handleException = (res, ex) => {
  sendResponse(res, 500, null, ex);
};

startServer();
