

// export const exportToCSV = (data: any[]) => {
//   console.log("Export Data (Before Processing):", data); 

//   const headers = [
//     "S.N", "First Name", "Last Name", "Email", "Designation",
//     "Mobile Number", "User Type", "To Do", "In Progress",
//     "Overdue", "Completed", "Status"
//   ];

//   const rows = data.map((user: any, index: number) => {
//     console.log("User Object:", user); 

    
//     let statusText = user.active ? "Active" : "Inactive";

//     return [
//       (index + 1).toString(),
//       user.fname || "",
//       user.lname || "",
//       user.email || "",
//       user.designation || "",
//       user.phone_number || "",
//       user.user_type || "",
//       user.todo_count?.toString() || "0",
//       user.in_progress_count?.toString() || "0",
//       user.overdue_count?.toString() || "0",
//       user.completed_count?.toString() || "0",
//       statusText
//     ];
//   });

//   console.log("Final CSV Rows:", rows); // Debugging

//   const csvContent = [
//     headers.join(","), 
//     ...rows.map((row) => row.join(","))
//   ].join("\n");

//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = "users.csv";
//   link.click();
// };



import Cookies from "js-cookie";

const fetchAllUsers = async () => {
    const token = Cookies.get("access_token");

    if (!token) {
        console.error("Authorization token is missing");
        return [];
    }

    try {
        const response = await fetch(import.meta.env.VITE_API_URL+`/users/export?active=true&user_type=user`, { 
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`API Erro
r: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
};
export const exportToCSV =async(data) => {
  const allUsers=await fetchAllUsers;
  console.log("Export Data (Before Processing):", data); 

  const headers = [
    "S.N", "First Name", "Last Name", "Email", "Designation",
    "Mobile Number", "User Type", "To Do", "In Progress",
    "Overdue", "Completed", "Status"
  ];

  const rows = data.map((user: any, index: number) => {
    console.log("User Object:", user); 

    
    let statusText = user.active ? "Active" : "Inactive";

    return [
      (index + 1).toString(),
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
      statusText
    ];
  });

  console.log("Final CSV Rows:", rows); 

  const csvContent = [
    headers.join(","), 
    ...rows.map((row) => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "users.csv";
  link.click();
};



{/*export const exportToCSV = async () => {


  const allUsers = await fetchAllUsers(); // Get all users from API

  if (allUsers.length === 0) {
      console.warn("No users available for export.");
      return;
  }

  console.log("Export Data (Before Processing):", allUsers); // Debugging

  const headers = [
      "S.N", "First Name", "Last Name", "Email", "Designation",
      "Mobile Number", "User Type", "To Do", "In Progress",
      "Overdue", "Completed", "Status"
  ];

  const rows = allUsers.map((user: any, index: number) => {
      console.log("User Object:", user); // Debugging

      let statusText = user.active ? "Active" : "Inactive";

      return [
          (index + 1).toString(),
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
          statusText
      ];
  });

  console.log("Final CSV Rows:", rows); // Debugging

  const csvContent = [
      headers.join(","), 
      ...rows.map((row) => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "users.csv";
  link.click();
};

export const exportToCSV = async () => {
  const allUsers = await fetchAllUsers(); // Get all users from API

  console.log("Fetched Users:", allUsers); // Debugging

  if (!allUsers || allUsers.length === 0) {
      console.warn("No users available for export.");
      return;
  }

  const headers = [
      "S.N", "First Name", "Last Name", "Email", "Designation",
      "Mobile Number", "User Type", "To Do", "In Progress",
      "Overdue", "Completed", "Status"
  ];

  const rows = allUsers.map((user: any, index: number) => {
      return [
          (index + 1).toString(),
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
          user.active ? "Active" : "Inactive"
      ];
  });

  const csvContent = "\ufeff" + [
      headers.join(","), 
      ...rows.map((row) => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "users.csv";
  document.body.appendChild(link);

  setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
  }, 100);
};
*/}
