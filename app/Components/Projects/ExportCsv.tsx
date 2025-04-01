
export const exportToCSV = (data) => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }

  const csvData = data.map((project) => ({
    Code: project.code || "N/A",
    Title: project.title || "N/A",
    Description: project.description || "N/A",
    Status: project.status === true || project.status === "true" ? "Active" : "Inactive",
    // "Created On": project.created_on
    //   ? new Date(project.created_on).toLocaleDateString("en-GB") // Format date as DD-MM-YYYY
    //   : "N/A",
  }));

  console.log("CSV Data:", csvData); // Debugging
  
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [
      ["Code", "Title", "Description", "Status"],
      ...csvData.map((row) =>
        [row.Code, row.Title, row.Description, row.Status].join(",")
      ),
    ].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "projects.csv");
  document.body.appendChild(link);
  link.click();
};
