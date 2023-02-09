import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Pagination } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { FaEdit, FaTrashAlt, FaRegPlusSquare } from "react-icons/fa";
import debounce from "lodash.debounce";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function App() {
  /* Add the useNavigate and useLocation Hook to transfer and retrieve 
  search and limit state form Add & Update Page */
  const navigate = useNavigate();
  const location = useLocation();

  // State Management to get all the data
  const [data, setData] = useState([]);
  console.log(data);

  // State Management for Pagination
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [initialValue] = useState(1);
  // Add a state to keep track of the search term and limit
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  /* console.log(searchTerm);
  console.log(limit); */

  // State Management for ID
  const [id, setId] = useState(null);

  // State Management to After delete the correct data
  const [idToDelete, setIdToDelete] = useState(null);

  // If the total records less then or equal to limits, the pagination should not be display
  const [count, setCount] = useState("");
  console.log(count);

  const GoToUpdate = (id) => {
    navigate("update/" + id, {
      state: { search: searchTerm, lim: limit, pg: page },
    });
  };

  const GoToAdd = () => {
    navigate("add/", { state: { search: searchTerm, lim: limit, pg: page } });
  };

  useEffect(() => {
    if (location.state) {
      setSearchTerm(location.state.search);
      setLimit(location.state.lim);
      setPage(initialValue);
    }
  }, [location.state]);

  // State Management to handel the Model
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlePageChange = (newPage) => {
    // console.log(`New Page: ${newPage}`);
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    const convertLimit = parseInt(event.target.value);
    setLimit(convertLimit);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Debounce to limit the rate of execution of search input action
  const debouncedResults = useMemo(() => {
    return debounce(handleSearchChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  // useEffect hook to fetch the data from database and set it to states
  useEffect(() => {
    fetchData(page, limit, searchTerm);
  }, [page, limit]);

  useEffect(() => {
    fetchData(initialValue, limit, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    fetchData(page, limit, searchTerm);
    setIdToDelete(null);
  }, [idToDelete]);

  const fetchData = async (page, limit, searchTerm) => {
    const result = await axios.get(
      `http://localhost:7000/?page=${page}&limit=${limit}&searchTerm=${searchTerm}`
    );
    setData(result.data.data);
    setTotalPages(result.data.totalPages);
    setCount(result.data.count);
  };

  // Delete Request to delete the Data By Id
  const onDelete = async () => {
    await axios
      .delete(`http://localhost:7000/${id}`)
      .then(() => {
        // console.log(`Deleted Id ${id}`);
        setIdToDelete(id);
        setData(data.filter((item) => item.id !== idToDelete));
      })
      .catch((err) => {
        console.log(err);
      });
    handleClose();
  };

  return (
    <div className="d-flex flex-column justify-content-center m-5">
      <div className="d-flex justify-content-end">
        <input
          className="me-5 rounded-2 p-2"
          type="text"
          placeholder="Search..."
          defaultValue={searchTerm}
          onChange={debouncedResults}
        />
        <select
          className="me-5 rounded-2 p-2"
          onChange={handleLimitChange}
          value={limit}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <button
          type="button"
          className="btn btn-info rounded-2 "
          onClick={() => {
            GoToAdd();
          }}
        >
          <FaRegPlusSquare />
        </button>
      </div>

      <div className="py-5">
        {data.length === 0 ? (
          <h1 className="text-center p-5">No Result Found!</h1>
        ) : (
          <div className="border" style={{ height: "500px", overflow: "auto" }}>
            <table
              className="table table-hover table-fixed"
              style={{ width: "100%", tableLayout: "fixed" }}
            >
              <thead
                className="tr"
                style={{
                  position: "sticky",
                  top: "0",
                  backgroundColor: "#fff",
                }}
              >
                <tr className="">
                  <th className="py-4 text-left align-middle">ID</th>
                  <th className="py-4 text-left align-middle">Project Name</th>
                  <th className="py-4 text-left align-middle">Version</th>
                  <th className="py-4 text-left align-middle">Build Number</th>
                  <th className="py-4 text-left align-middle">Description</th>
                  <th className="py-4 text-left align-middle">Created Date</th>
                  <th className="py-4 text-left align-middle">Edit</th>
                  <th className="py-4 text-left align-middle">Delete</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="text-left align-middle">{item.id}</td>
                    <td className="text-left align-middle">
                      {item.project_name}
                    </td>
                    <td className="text-left align-middle">{item.version}</td>
                    <td className="text-left align-middle">{item.build_no}</td>
                    <td className="text-left align-middle">
                      {item.release_note}
                    </td>
                    <td className="text-left align-middle">{item.date}</td>
                    <td className="text-left align-middle">
                      {/* Update Button */}
                      <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={() => {
                          setId(item.id);
                          GoToUpdate(item.id);
                        }}
                      >
                        <FaEdit />
                      </button>
                    </td>

                    <td className="text-left align-middle">
                      <div>
                        {/* Delete Button */}
                        <button
                          type="button"
                          className="btn btn-info btn-sm"
                          onClick={() => {
                            setId(item.id);
                            handleShow();
                          }}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-end mt-5">
        {/* {data.length > 0 ? ( */}
        {count > limit && (
          <Pagination
            defaultActivePage={page}
            totalPages={totalPages}
            onPageChange={(e, { activePage }) => handlePageChange(activePage)}
          />
        )}
        {/* ) : null} */}

        {/* Delete Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this data?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>

            {/* Modal Delete Button */}
            <Button variant="info" onClick={() => onDelete()}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default App;
