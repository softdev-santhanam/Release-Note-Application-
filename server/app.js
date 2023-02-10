const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");
const port = 7000;
const cors = require("cors");

//access-control-allow-credentials:true
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Using Sequelize to manage the database
const sequelize = new Sequelize("crud", "santhanakrishnan", "Askrrdc@#$sql1", {
  dialect: "mysql",
});

/* Start Create a Table */
const release_notes_data = sequelize.define(
  "release_notes_data",
  {
    project_name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    version: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    build_no: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    release_note: Sequelize.TEXT,
    date: Sequelize.STRING,
    isDelete: Sequelize.STRING,
  },
  { tableName: "release_notes_data" }
);
/* End Create a Table */

/* Start Post Data */
app.post("/", async (req, res) => {
  const project_name = req.body.project_name;
  const version = req.body.version;
  const build_no = req.body.build_no;
  const release_note = req.body.release_note;
  const date = req.body.date;
  const isDelete = req.body.isDelete;

  // Check if the project name already exists
  const project = await release_notes_data.findOne({ where: { project_name } });
  if (project) {
    // Check for the isDelete "0" or "1"
    const find_data = await release_notes_data.findOne({
      where: { project_name, version, build_no, isDelete: "1" },
    });
    // if isDelete is "0"
    if (find_data) {
      // Update the isDelete field to "1"
      try {
        const update_isDelete = await release_notes_data.update(
          { isDelete: "0" },
          { where: { project_name, version, build_no, isDelete: "1" } }
        );
        res.status(400).send({ error: "Data Successfully Retrieved" });
      } catch (err) {
        res.send(err);
      }
    } else {
      // when ever I entered the float data its showing data not found
      return res.status(400).send({ error: "Project name already exists" });
    }
  } else {
    try {
      const post_data = await release_notes_data.create({
        project_name,
        version,
        build_no,
        release_note,
        date,
        isDelete,
      });
      f;
      res.send("Data Updated");
    } catch (err) {
      res.send;
    }
  }
});
/* End Post Data */

/* Start Get All Data with pagination */
app.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const currentPage = parseInt(req.query.page) || 1;
  const offset = Number((currentPage - 1) * limit);
  const { project_name, id, build_no, searchTerm } = req.query;

  let where = { isDelete: "0" }; // exclude the data with isDelete set to 1
  if (searchTerm) {
    where[Sequelize.Op.or] = [
      { project_name: { [Sequelize.Op.like]: `%${searchTerm}%` } },
      { id: { [Sequelize.Op.like]: `%${searchTerm}%` } },
      { build_no: { [Sequelize.Op.like]: `%${searchTerm}%` } },
    ];
  }
  if (project_name) {
    where.project_name = project_name;
  }
  if (id) {
    where.id = id;
  }
  if (build_no) {
    where.build_no = build_no;
  }

  const { count, rows } = await release_notes_data.findAndCountAll({
    where,
    limit,
    offset,
    order: [["id", "DESC"]], // sort data in descending order based on id
  });

  const totalPages = Math.ceil(count / limit);

  res.send({ data: rows, totalPages, count });
});
/* End Get All Data with pagination */

/* Start Get Unique data by ID */
app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const find_one = await release_notes_data.findOne({
      where: { id },
    });
    res.send(find_one);
  } catch (err) {
    res.send(err);
  }
});
/* End Get Unique data by ID */

/* Start Update data */
app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const project_name = req.body.project_name;
  const version = req.body.version;
  const build_no = req.body.build_no;

  // Check if the project name already exists
  const project = await release_notes_data.findOne({ where: { project_name } });
  if (project) {
    // Check for the isDelete "0" or "1"
    const find_data = await release_notes_data.findOne({
      where: { project_name, version, build_no, isDelete: "1" },
    });
    // if isDelete is "0"
    if (find_data) {
      // Update the isDelete field to "1"
      try {
        const update_isDelete = await release_notes_data.update(
          { isDelete: "0" },
          { where: { project_name, version, build_no, isDelete: "1" } }
        );
        res.status(400).send({ error: "Data Successfully Retrieved" });
      } catch (err) {
        res.send(err);
      }
    } else {
      // if the idDelete is "0" the data is already available on the table just update it
      const projects = await release_notes_data.findOne({
        where: { project_name: project_name, id: { [Sequelize.Op.ne]: id } },
      });

      if (projects) {
        return res.status(400).send({ error: "Project name already exists" });
      }

      try {
        await release_notes_data.update(data, { where: { id } });
        res.send("Data Updated");
      } catch (err) {
        res.send(err);
      }
    }
  } else {
    const projects = await release_notes_data.findOne({
      where: { project_name: project_name, id: { [Sequelize.Op.ne]: id } },
    });

    if (projects) {
      return res.status(400).send({ error: "Project name already exists" });
    }

    try {
      await release_notes_data.update(data, { where: { id } });
      res.send("Data Updated");
    } catch (err) {
      res.send(err);
    }
  }
});
/* End Update data */

/* start Delete data */
app.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Instead of deleting the data, we just update the isDelete column to 1
    await release_notes_data.update({ isDelete: "1" }, { where: { id } });
    res.send("Data Deleted");
  } catch (err) {
    res.send(err);
  }
});
/* start Delete data */

app.listen(port, () => {
  console.log(`Server connected at the port ${port}`);
});
