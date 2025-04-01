export const exportToCSV = (data: any[]) => {
    // Define the CSV headers
    const headers = [
      "S.N",
      "First Name",
      "Last Name",
      "Email",
      "Designation",
      "Mobile Number",
      "User Type",
      "To Do",
      "In Progress",
      "Overdue",
      "Completed",
      "Status"
    ];
  
    // Map through the data and extract values for each user
    const rows = data.map((user: any, index: number) => {
      return [
        (index + 1).toString(), // Serial Number
        user.fname || "",
        user.lname || "",
        user.email || "",
        user.designation || "",
        user.phone_number || "",
        user.user_type || "",
        user.todo_count?.toString() || "0",
        user.in_progress_count?.toString() || "0",
        user.overdue_count?.toString() || "0",
        user.completed_count?.toString() || "0",
        user.status === "active" ? "Active" : "Inactive"
      ];
    });
  
    // Create the CSV string
    const csvContent = [
      headers.join(","), // Add the headers as the first row
      ...rows.map((row) => row.join(",")) // Add each user data as a new row
    ].join("\n");
  
    // Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
    // Create a link to download the CSV file
    const link = document.createElement("a");
    const fileName = "users.csv"; // Define the filename for the CSV file
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click(); // Trigger the download
  };
  