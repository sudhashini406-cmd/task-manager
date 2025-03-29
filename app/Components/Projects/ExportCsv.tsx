//we can direct import from saveas  //npm i --save-dev @types/file-saver
export const exportToCSV = (data: any[], filename = "projects.csv") => {
  if (!data || data.length === 0) {
    alert("No data available for export!");
    return;
  }

  const headers = Object.keys(data[0]).join(",");

  // Convert data to CSV format
  const csvContent =
    headers + // headers contain column names
    "\n" +
    data.map((row) => Object.values(row).join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  //  Remove the element and revoke the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
