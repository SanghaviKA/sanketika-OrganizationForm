const express = require("express");
const bodyParser = require("body-parser");
const UtilsService = require("./Utils/util");
const cors = require("cors");

const fs = require("fs");
const _ = require("lodash");
const { fileURLToPath } = require("url");
const { json } = require("express");
const { copyDone } = require("pg-protocol/dist/messages");

const app = express();
const filePath = "./db.json";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.get("/organizations", (req, res) => {
  let data = fs.readFileSync(filePath);
  let json = JSON.parse(data);
  res.json(json);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/organisation/create", (req, res) => {
  const primaryKey = "email";

  let fileData = fs.readFileSync(filePath, "utf-8");
  let jsonData = !_.isEmpty(fileData) ? JSON.parse(fileData) : fileData;

  var result = [];
  const orgDetails = req.body;
  if (!_.isEmpty(jsonData)) {
    const existingOrg = _.find(jsonData.organisations, [
      primaryKey,
      orgDetails[primaryKey],
    ]);
    if (!existingOrg) {
      result = {
        organisations: _.unionBy(jsonData.organisations, [orgDetails], "id"),
      };
    } else {
      // alert("Organization with the same email already exists");
      return res
        .send({ status: "Organization with the same email already exists" })
        .status(400);
    }
  } else {
    result = {
      organisations: [req.body],
    };
  }
  const isUpdated = UtilsService.Utils.updateFile(result);
  if (isUpdated == false) {
    res.send({ status: "failed to save the organisation details" }).status(400);
  } else {
    res.send({ status: "Orginsation data saved" }).status(200);
  }
});
app.post("/organizations/employees", (req, res) => {
  const primaryKey = "email";
  const orgName = req.body.orgName;
  const emps = req.body.employees;
  let jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const result = _.flattenDeep(
    _.map(jsonData, (value, key) => {
      return _.map(value, (obj) => {
        if (obj.orgName === orgName) {
          const mergedEmploy = _.union(obj.employees, emps);
          obj.employees = _.uniqBy(mergedEmploy, primaryKey);
        }
        return obj;
      });
    })
  );
  const updatedObj = {
    organisations: result,
  };

  const isUpdated = UtilsService.Utils.updateFile(updatedObj);
  if (isUpdated == false) {
    res.send({ status: "failed to save the data" }).status(400);
  } else {
    res.send({ status: "Request Updated" }).status(200);
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
