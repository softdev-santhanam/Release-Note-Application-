import axios from "axios";
import "../App.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Table, Pagination } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const itemsPerPage = 5;
const Posts = () => {
  const [data, setData] = useState([]);

  // state to store the current page number
  const [currentPage, setCurrentPage] = useState(1);

  // function to handle pagination changes:
  const handlePaginationChange = (e, { activePage }) =>
    setCurrentPage(activePage);

  // function to return the data for the current page:
  const getDataForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Post Data in "/"
  useEffect(() => {
    axios
      .get("http://localhost:7000/")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Delete Data By Id
  const onDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (confirm) {
      alert("Data deleted successfully!");
      await axios
        .delete(`http://localhost:7000/${id}`)
        .then(() => {
          console.log("Data deleted successfully.");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    window.location.href = "/";
  };

  return (
    <div className="d-flex flex-column justify-content-center m-5">
      <div className="m-5 d-flex justify-content-end">
        <Link to="/add">
          <button type="button" className="btn btn-primary p-2 ">
            Create New Notes
          </button>
        </Link>
      </div>
      <div>
        <Table className="table caption-top table-striped table-hover border ">
          <caption>
            <h3>List of Notes</h3>
          </caption>
          <Table.Header className="tr">
            <Table.Row className="">
              <Table.HeaderCell className="p-3">ID</Table.HeaderCell>
              <Table.HeaderCell className="p-3">Project Name</Table.HeaderCell>
              <Table.HeaderCell className="p-3">Version</Table.HeaderCell>
              <Table.HeaderCell className="p-3">Build Number</Table.HeaderCell>
              <Table.HeaderCell className="p-3">Description</Table.HeaderCell>
              <Table.HeaderCell className="p-3">Created Date</Table.HeaderCell>
              <Table.HeaderCell className="p-3">Edit</Table.HeaderCell>
              <Table.HeaderCell className="p-3">Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {getDataForCurrentPage().map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.project_name}</Table.Cell>
                <Table.Cell>{item.version}</Table.Cell>
                <Table.Cell>{item.build_no}</Table.Cell>
                <Table.Cell>{item.release_note}</Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>
                  <Link to={"update/" + item.id}>
                    <button type="button" className="btn btn-info">
                      <FaEdit />
                    </button>
                  </Link>
                </Table.Cell>

                <Table.Cell>
                  <button
                    type="button"
                    className="bi-trash"
                    onClick={() => onDelete(item.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <nav className="d-flex justify-content-end m-5">
        <Pagination
          defaultActivePage={currentPage}
          totalPages={Math.ceil(data.length / itemsPerPage)}
          onPageChange={handlePaginationChange}
        />
      </nav>
    </div>
  );
};

export default Posts;
