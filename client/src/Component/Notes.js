app.put("/restore/:project_name", async (req, res) => {
    const project_name = req.params.project_name;
  
    try {
      const update_data = await crud_table.update(
        { isDelete: "0" },
        { where: { project_name } }
      );
      res.send({ message: "Data Restored" });
    } catch (err) {
      res.send(err);
    }
  });
  

/*   To add deleted data, you need to modify the code to update the deleted data's isDelete column to 0 when it is added back. You can add a new route for this purpose, for example "/addDeletedData/:id". In this route, you can find the deleted data by id, update the isDelete column to 0, and then send a response indicating that the data has been added back.

Here is the code for the new route: */

// Add Deleted Data
app.put("/addDeletedData/:id", async (req, res) => {
const id = req.params.id;

try {
const deletedData = await crud_table.findOne({ where: { id } });
if (!deletedData) {
return res.status(400).send({ error: "Data not found" });
}
await crud_table.update({ isDelete: "0" }, { where: { id } });
res.send("Data added back");
} catch (err) {
res.send(err);
}
});