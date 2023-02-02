import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Table, Pagination } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import debounce from "lodash.debounce";

function App() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        `http://localhost:7000/?page=${page}&limit=${limit}&searchTerm=${searchTerm}`
      );
      setData(result.data.data);
      setTotalPages(result.data.totalPages);
    };
    fetchData();
  }, [page, limit, searchTerm]);

  const handlePageChange = (newPage) => {
    console.log(`New Page: ${newPage}`);
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Debounce
  const debouncedResults = useMemo(() => {
    return debounce(handleSearchChange, 300);
  }, []);
  const debouncedResultsLimit = useMemo(() => {
    return debounce(handleLimitChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
      debouncedResultsLimit.cancel();
    };
  });

  // Delete Request
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
      <div className="d-flex justify-content-end">
        <input
          className="me-5 rounded-2 p-2"
          type="text"
          placeholder="Search..."
          onChange={debouncedResults}
        />
        <input
          type="number"
          className="me-5 rounded-2 p-2"
          placeholder="Limit"
          onChange={debouncedResultsLimit}
        ></input>
        <Link to="/add">
          <button type="button" className="btn btn-primary p-2 rounded-2">
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
              <Table.HeaderCell className="py-4 text-left">ID</Table.HeaderCell>
              <Table.HeaderCell className="py-4 text-left">
                Project Name
              </Table.HeaderCell>
              <Table.HeaderCell className="py-4 text-left">
                Version
              </Table.HeaderCell>
              <Table.HeaderCell className="py-4 text-left">
                Build Number
              </Table.HeaderCell>
              <Table.HeaderCell className="py-4 text-left">
                Description
              </Table.HeaderCell>
              <Table.HeaderCell className="py-4 text-left">
                Created Date
              </Table.HeaderCell>
              <Table.HeaderCell className="py-4 text-left">
                Edit
              </Table.HeaderCell>
              <Table.HeaderCell className="py-4 text-left">
                Delete
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell className="text-left">{item.id}</Table.Cell>
                <Table.Cell className="text-left">
                  {item.project_name}
                </Table.Cell>
                <Table.Cell className="text-left">{item.version}</Table.Cell>
                <Table.Cell className="text-left">{item.build_no}</Table.Cell>
                <Table.Cell className="text-left">
                  {item.release_note}
                </Table.Cell>
                <Table.Cell className="text-left">{item.date}</Table.Cell>
                <Table.Cell className="text-left">
                  <Link to={"update/" + item.id}>
                    <button
                      type="button"
                      className="btn btn-info btn-sm"
                      width="10px"
                      height="10px"
                    >
                      <FaEdit />
                    </button>
                  </Link>
                </Table.Cell>

                <Table.Cell className="text-center">
                  <button
                    width="10px"
                    height="10px"
                    type="button"
                    className="btn btn-info btn-sm"
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
      <div className="d-flex justify-content-end mt-5">
        <Pagination
          defaultActivePage={page}
          totalPages={totalPages}
          onPageChange={(event, { activePage }) => handlePageChange(activePage)}
        />
      </div>
    </div>
  );
}

export default App;
