const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");
const port = 7000;
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
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
    project_name: Sequelize.STRING,
    version: Sequelize.DECIMAL,
    build_no: Sequelize.DECIMAL,
    release_note: Sequelize.TEXT,
    date: Sequelize.STRING,
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
  const post_data = crud_table.build({
    project_name,
    version,
    build_no,
    release_note,
    date,
  });
  await post_data.save();
  res.redirect("/");
});

// Get All Data
app.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || null;
  const currentPage = parseInt(req.query.page) || 1;
  const offset = Number((currentPage - 1) * limit);
  const { project_name, id, build_no, searchTerm } = req.query;

  let where = {};
  if (searchTerm) {
    where[Sequelize.Op.or] = [
      { project_name: { [Sequelize.Op.like]: `%${searchTerm}%` } },
      { id: { [Sequelize.Op.like]: `%${searchTerm}%` } },
      { build_no: { [Sequelize.Op.like]: `%${searchTerm}%` } },
    ];
  }
  if (project_name) {
    where.project_name = project_name
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
    res.redirect("/");
  } catch (err) {
    res.send;
  }
});

// Delete data
app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const delete_data = await crud_table.destroy({
      where: { id },
    });
    res.redirect("/");
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Server connected at the port ${port}`);
});
