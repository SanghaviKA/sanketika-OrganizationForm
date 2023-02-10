import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "antd";
import axios from "axios";

function EmployeeUpload() {
  const [file, setFile] = useState("");

  const handleFileChange = (event) => {
    const fileSize = event.target.files[0].size;
    const maxFileSize = 1000;
    if (fileSize > maxFileSize) {
      alert(
        `File size should not exceed ${maxFileSize} bytes., The uploaded file size is ${fileSize} bytes`
      );
      return;
    } else {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async () => {
        const employeeData = JSON.parse(reader.result);

        var config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "http://localhost:3000/organizations/employees",
          headers: {
            "Content-Type": "application/json",
          },
          data: employeeData,
        };
        axios(config)
          .then(function (response) {})
          .catch(function (error) {
            console.log(error);
          });
      };
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToDetails = () => {
    window.location.href = "/details";
  };
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "50%" }}>
          <h1 style={{ textAlign: "center" }}>Employee Upload</h1>
          <Form.Item>
            <label>
              JSON File:
              <input type="file" onChange={handleFileChange} accept=".json" />
            </label>
          </Form.Item>
          <Form.Item>
            <label>Note: Only JSON file is supported</label>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={navigateToDetails}
              style={{ marginRight: "20px" }}
            >
              Submit
            </Button>
            <Link to="/">
              <Button type="primary">Previous</Button>
            </Link>
          </Form.Item>
        </div>
      </div>
    </form>
  );
}
export default EmployeeUpload;
