import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button } from "antd";
import { StateManager } from "../Utils/StateManager";
import CompoundedSpace from "antd/es/space";
import { v4 as uuidv4 } from "uuid";

function OrganizationForm() {
  const navigate = useNavigate();
  const pageKey = "org-form-page-1";

  const formObj = StateManager.getState(pageKey);

  const [formData, setFormData] = useState({
    orgName: StateManager.getState(pageKey)["orgName"] || "",
    orgAddress: StateManager.getState(pageKey)["orgAddress"] || "",
    phoneNumber: StateManager.getState(pageKey)["phoneNumber"] || "",
    email: StateManager.getState(pageKey)["email"] || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (formObj) => {
    formObj["id"] = uuidv4();
    StateManager.setState(pageKey, formObj);
    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/organisation/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: formObj,
    };
    axios(config)
      .then(function (response) {
        navigate("/employee-upload");
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          window.alert("Organization with the same email already exists");
        } else {
          console.log(error);
        }
      });

    //     .catch(function (error) {
    //       console.log(error);
    //     });
  };

  return (
    <Form onFinish={handleSubmit}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "50%" }}>
          <h2 style={{ textAlign: "center" }}>Organization Details</h2>
          <Form.Item
            label="Organization Name"
            name="orgName"
            initialValue={formData.orgName}
            rules={[
              {
                required: true,
                message: "Please input your organization name!",
              },
              {
                pattern: /^[a-zA-Z ]+$/,
                message: "Organization name should only contain alphabets",
              },
              {
                max: 30,
                message: "Organization name should be maximum 30 characters",
              },
            ]}
            onChange={handleChange}
          >
            <Input placeholder="Organization Name" />
          </Form.Item>

          <Form.Item
            label="Organization Address"
            name="orgAddress"
            initialValue={formData.orgAddress}
            rules={[
              {
                required: true,
                message: "Please input your organization address!",
              },
              {
                max: 100,
                message: "Organization address should not exceed 100 letters.",
              },
            ]}
            onChange={handleChange}
          >
            <Input placeholder="Organization Address" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            initialValue={formData.phoneNumber}
            rules={[
              {
                pattern: /^\d+$/,
                message: "Only numbers are allowed",
              },
              {
                max: 10,
                message: "Phone number should be maximum 10 digits",
              },
              {
                min: 10,
                message: "Phone number should be maximum 10 digits",
              },
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
            onChange={handleChange}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            initialValue={formData.email}
            rules={[
              {
                type: "email",
                message: "The input is not valid email!",
              },
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
            onChange={handleChange}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Next
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
}

export default OrganizationForm;
