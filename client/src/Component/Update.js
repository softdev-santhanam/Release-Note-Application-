import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
  const { id } = useParams(); //The useParams() hook helps us to access the URL parameters from a current route.
  const [data, setData] = useState({
    userId: null,
    project_name: null,
    version: "",
    build_no: "",
    release_note: null,
  });

  const [errors, setErrors] = useState({
    project_name: "",
    version: "",
    build_no: "",
    release_note: "",
  });

  const { project_name, version, build_no, release_note } = data;

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;
    const projectNameRegex = /^[a-zA-Z0-9\s]+$/;
    const versionRegex = /^[0-9]+(\.[0-9]+)*$/;
    const buildNumberRegex = /^[0-9]+(\.[0-9]+)*$/;
    const releaseNoteRegex = /^[a-zA-Z0-9\s]+$/;

    if (!projectNameRegex.test(project_name)) {
      setErrors((prev) => ({ ...prev, project_name: "Project name is invalid. Please insert only letters and numbers." }));
      isValid = false;
    }

    if (!versionRegex.test(version)) {
      setErrors((prev) => ({ ...prev, version: "Version number not valid Please enter only decimal and digit numbers." }));
      isValid = false;
    }

    if (!buildNumberRegex.test(build_no)) {
      setErrors((prev) => ({ ...prev, build_no: "Build number not valid Please enter only decimal and digit numbers." }));
      isValid = false;
    }

    if (!releaseNoteRegex.test(release_note)) {
      setErrors((prev) => ({
        ...prev,
        release_note: "Release note is required",
      }));
      isValid = false;
    }

    return isValid;
  };

  const updateNotes = (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        axios.put(`http://localhost:7000/${id}`, data);
        console.log(data);
        alert("Form Updated Successfully!");
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const loadUser = () => {
    fetch(`http://localhost:7000/${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setData({
          userId: result.id,
          project_name: result.project_name,
          version: result.version,
          build_no: result.build_no,
          release_note: result.release_note,
        });
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="form-group d-flex flex-column container center_div mt-5">
      <div className="mt-5">
        <h1>Add New Notes</h1>
      </div>
      <div className="mb-3 mt-3">
        <input
          className="form-control"
          type="text"
          placeholder="Project Name"
          name="project_name"
          value={project_name}
          onChange={handleChange}
          id="my_input"
        />
        {errors.project_name && (
          <div className="alert alert-danger">{errors.project_name}</div>
        )}
      </div>

      <div className="mb-3">
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

      <div className="mb-3">
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
          <button className="btn btn-primary" onClick={updateNotes}>
            Update
          </button>
        </div>

        <div className="mb-3 m-2">
          <Link to="/">
            <button className="btn btn-primary">Go Back</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
