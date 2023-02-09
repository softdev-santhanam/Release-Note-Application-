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

// Create a Table
const crud_table = sequelize.define(
  "crud_table",
  {
    project_name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    version: Sequelize.DECIMAL,
    build_no: Sequelize.DECIMAL,
    release_note: Sequelize.TEXT,
    date: Sequelize.STRING,
    isDelete: Sequelize.STRING,
  },
  { tableName: "crud_table" }
);

// Post Data
app.post("/", async (req, res) => {
  const project_name = req.body.project_name;
  const version = req.body.version;
  const build_no = req.body.build_no;
  const release_note = req.body.release_note;
  const date = req.body.date;
  const isDelete = req.body.isDelete;

  // Check if the project name already exists
  const project = await crud_table.findOne({ where: { project_name } });
  if (project) {
    return res.status(400).send({ error: "Project name already exists" });
  } else {
    const post_data = await crud_table.create({
      project_name,
      version,
      build_no,
      release_note,
      date,
      isDelete,
    });
  }
});


// Get All Data with pagination
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

  const { count, rows } = await crud_table.findAndCountAll({
    where,
    limit,
    offset,
    order: [["id", "DESC"]], // sort data in descending order based on id
  });

  const totalPages = Math.ceil(count / limit);

  res.send({ data: rows, totalPages, count });
});

// Get Unique data by ID
app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const find_one = await crud_table.findOne({
      where: { id },
    });
    res.send(find_one);
  } catch (err) {
    res.send(err);
  }
});

// Update data
app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const update_data = await crud_table.update(data, {
      where: { id },
    });
    res.send("Data Updated");
  } catch (err) {
    res.send;
  }
});

// Delete data
app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const delete_data = await crud_table.update(
      { isDelete: "1" },
      { where: { id } }
    );
    res.send({ status: "success", message: "Data deleted successfully" });
  } catch (err) {
    res.send({ status: "error", message: "Error while deleting data" });
  }
});

app.listen(port, () => {
  console.log(`Server connected at the port ${port}`);
});
