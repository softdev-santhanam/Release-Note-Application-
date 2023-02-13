import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const EditEmployee = () => {
  const [warning, setWarning] = useState("");
  // console.log(warning);

  // Handle Search Limit in Update Page
  const navigate = useNavigate();
  const PageData = useLocation().state;
  const searchTerm = PageData.search;
  const limit = PageData.lim;
  const page = PageData.pg;

  const handleGoBack = () => {
    navigate("/", { state: { search: searchTerm, lim: limit, pg: page } });
  };

  //The useParams() hook helps us to access the URL parameters from a current route.
  const { id } = useParams();

  // State Management to get all the data
  const [data, setData] = useState({
    userId: "",
    project_name: "",
    version: "",
    build_no: "",
    pipe_line: "",
    git_link: "",
    release_note: "",
  });

  // State Management for error validation
  const [errors, setErrors] = useState({
    project_name: "",
    version: "",
    build_no: "",
    pipe_line: "",
    git_link: "",
    release_note: "",
  });
  const [originalData, setOriginalData] = useState({});

  // State Management to handel the Model
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const modalRetrieve = "Data Successfully Retrieved";

  const handelNavigate = () => {
    navigate("/", { state: { search: searchTerm, lim: limit, pg: page } });
  };

  const { project_name, version, build_no, pipe_line, git_link, release_note } =
    data;

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setWarning("");
    setErrors("");
  };

  // Update Form Validation using Regular Expression
  const validate = () => {
    let isValid = true;
    const versionRegex = /^[0-9]+(\.[0-9]+)*$/;
    const buildNumberRegex = /^[-+]?\d+$/;
    const releaseNoteRegex = /[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/;
    const pipeLineRegex = /[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/;
    const gitLinkRegex = /[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/;

    if (!versionRegex.test(version)) {
      setErrors((prev) => ({
        ...prev,
        version:
          "Version number not valid Please enter only decimal and digit numbers.",
      }));
      isValid = false;
    }

    if (!buildNumberRegex.test(build_no)) {
      setErrors((prev) => ({
        ...prev,
        build_no: "Build number not valid Please enter only Numbers.",
      }));
      isValid = false;
    }

    if (!releaseNoteRegex.test(release_note)) {
      setErrors((prev) => ({
        ...prev,
        release_note: "Release Note is required",
      }));
      isValid = false;
    }

    if (!pipeLineRegex.test(pipe_line)) {
      setErrors((prev) => ({
        ...prev,
        pipe_line: "Pipe Line is required",
      }));
      isValid = false;
    }

    if (!gitLinkRegex.test(git_link)) {
      setErrors((prev) => ({
        ...prev,
        git_link: "GitHub link is required",
      }));
      isValid = false;
    }

    return isValid;
  };

  // Update request to specific data by id
  const updateNotes = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("try");
      try {
        await axios.put(`http://localhost:7000/${id}`, data);
        handleShow();
        console.log(`handleShow`);
      } catch (error) {
        if (error.response.status === 400) {
          console.log("Duplication");
          setWarning(error.response.data.error);
          if (modalRetrieve === error.response.data.error) {
            handleShow();
          }
        } else {
          console.error(error);
        }
      }
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  // Load the existing user data in form to update
  const loadUser = () => {
    fetch(`http://localhost:7000/${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setData({
          userId: result.id,
          project_name: result.project_name,
          version: result.version,
          build_no: result.build_no,
          pipe_line: result.pipe_line,
          git_link: result.git_link,
          release_note: result.release_note,
        });
        setOriginalData({
          userId: result.id,
          project_name: result.project_name,
          version: result.version,
          build_no: result.build_no,
          pipe_line: result.pipe_line,
          git_link: result.git_link,
          release_note: result.release_note,
        });
      })
      .catch((error) => console.log("error", error));
  };

  // Check for the update and block the update by disabled the update button
  const updateButtonDisabled = () => {
    if (
      originalData.project_name === project_name &&
      originalData.version === version &&
      originalData.build_no === build_no &&
      originalData.pipe_line === pipe_line &&
      originalData.git_link === git_link &&
      originalData.release_note === release_note
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="form-group d-flex flex-column container center_div mt-5">
      <div className="mt-5">
        <h1>Update Notes</h1>
      </div>
      <div className="mb-3 mt-3">
        <label className="py-2">
          <h4>Project Name</h4>
        </label>
        <select
          className="form-control"
          type="text"
          placeholder="Project Name"
          name="project_name"
          value={project_name}
          onChange={handleChange}
          id="my_input"
        >
          <option value={"Location Tracker"}>Location Tracker</option>
          <option value={"Attendance Monitor"}>Attendance Monitoring</option>
          <option value={"Check In/Check Out"}>Check In/Check Out</option>
          <option value={"Waiting Timer"}>Waiting Timer</option>
          <option value={"Meeting Notes"}>Meeting Notes</option>
          <option value={"Analytics"}>Analytics</option>
        </select>

        {/* Render the warning message if it exists */}
        {warning && <div className="alert alert-danger">{warning}</div>}
      </div>

      <div className="mb-3">
        <label className="py-2">
          <h4>Version</h4>
        </label>
        <input
          className="form-control"
          type="number"
          placeholder="Version"
          name="version"
          value={version}
          onChange={handleChange}
          id="my_input"
        />
        {errors.version && (
          <div className="alert alert-danger">{errors.version}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="py-2">
          <h4>Build Number</h4>
        </label>
        <input
          className="form-control"
          type="number"
          placeholder="Build Number"
          name="build_no"
          value={build_no}
          onChange={handleChange}
          id="my_input"
        />
        {errors.build_no && (
          <div className="alert alert-danger">{errors.build_no}</div>
        )}
      </div>

      <div className="mb-3 mt-3">
        <label className="py-2">
          <h4>Pipe Line</h4>
        </label>
        <input
          className="form-control"
          type="text"
          placeholder="Project Name"
          name="pipe_line"
          value={pipe_line}
          onChange={handleChange}
          id="my_input"
        />
        {errors.pipe_line && (
          <div className="alert alert-danger">{errors.pipe_line}</div>
        )}
      </div>

      <div className="mb-3 mt-3">
        <label className="py-2">
          <h4>GitHub Link</h4>
        </label>
        <input
          className="form-control"
          type="text"
          placeholder="Project Name"
          name="git_link"
          value={git_link}
          onChange={handleChange}
          id="my_input"
        />
        {errors.git_link && (
          <div className="alert alert-danger">{errors.git_link}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="py-2">
          <h4>Release Note</h4>
        </label>
        <textarea
          className="form-control"
          rows={5}
          type="text"
          placeholder="Release Note"
          name="release_note"
          value={release_note}
          onChange={handleChange}
          id="my_input"
        />
        {errors.release_note && (
          <div className="alert alert-danger">{errors.release_note}</div>
        )}
      </div>

      <div className="d-flex">
        <div className="mb-3 m-2">
          <Button
            variant="primary"
            type="submit"
            onClick={updateNotes}
            disabled={updateButtonDisabled()}
          >
            Update
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>Record updated successfully!</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handelNavigate}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="mb-3 m-2">
          <button className="btn btn-primary" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
