import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import "./DetailsPage.css";

function updateEmployeeObj(data) {
  const emp = [];
  const obj = data.map((obj) => {
    obj.organisations.map((org) => {
      emp.push(org.employees);
    });
  });
  let flattened = [].concat.apply([], emp);
  return flattened;
}
function DetailsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:3000/organizations`)
      .then((response) => {
        const isArrayResponse = Array.isArray(response.data);
        const updatedResponse = isArrayResponse
          ? response.data
          : [response.data];

        let orgArray = [];
        updatedResponse.filter(function (item) {
          let duplicateFound = orgArray.find(function (el) {
            return (
              el.orgName === item.orgName ||
              el.orgAddress === item.orgAddress ||
              el.orgId === item.organizationId
            );
          });

          if (!duplicateFound) {
            orgArray.push(item);
          }
        });
        setOrganizations(orgArray);
        const emp = updateEmployeeObj(updatedResponse);

        setEmployees(emp);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);
  const handleClick = (org) => {
    setSelectedOrg(org);
  };

  return (
    <div>
      <h1>Organization Details</h1>
      {organizations.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Organization Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {organizations[0].organisations.map((org, index) => (
              <tr key={index}>
                {/* <td>{index + 1}</td> */}
                <td>{org.id}</td>
                <td>{org.orgName}</td>
                <td>{org.orgAddress}</td>
                <td>{org.phoneNumber}</td>
                <td>{org.email}</td>
                <td>
                  <Button variant="primary" onClick={() => handleClick(org)}>
                    View Employees
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No data available</div>
      )}
      {selectedOrg && (
        <div>
          <h2>Employees of {selectedOrg.orgName}</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Age</th>
                <th>Address</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrg.employees.map((emp, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{emp.name}</td>
                  <td>{emp.age}</td>
                  <td>{emp.address}</td>
                  <td>{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default DetailsPage;
