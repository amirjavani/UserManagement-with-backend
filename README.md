# User Management Application

A **User Management Application** built using **ASP.NET MVC** for the backend and **JavaScript (jQuery, Bootstrap, Chart.js)** for the frontend. This project manages users and groups with CRUD operations and additional features like bulk deletion, CSV export, and data visualization.

## Features

### **User Management**
- **Add User:** Create new users via a dedicated modal.
- **Edit User:** Update user details using a modal form.
- **Delete User:** Remove users with confirmation.
- **Bulk Delete Users:** Select multiple users and delete them at once.
- **Assign Users to Groups:** Each user can be assigned to a group.
- **Search Users:** Filter users dynamically in the table.
- **Pagination:** Implemented for better user management.
- **Export Users to CSV:** Download the user table as a CSV file.

### **Group Management**
- **Add Group:** Create new groups.
- **Delete Group:** Remove groups.
- **View Group Details:** Display information about a specific group.
- **Bulk Delete Groups:** Select multiple groups and delete them at once.

### **User Statistics (Chart)**
- A **chart** displays the number of users categorized by:
  - **City**
  - **Group**
  - Other attributes
- Implemented using **Chart.js** for dynamic data visualization.

## Technologies Used

- **Backend:** ASP.NET MVC, C#
- **Frontend:** JavaScript, jQuery, Bootstrap
- **Data Storage:** JSON file (instead of a database)
- **Charts:** Chart.js
- **API:** RESTful services for user and group operations

## API Endpoints

### **Group API**
- `GET /groups` – Fetch all groups.
- `GET /group/fetch-table` – Get group table data.
- `POST /user/add-new-group` – Add a new group.
- `POST /group/single-delete/{id}` – Delete a single group.
- `POST /group/group-list-delete` – Bulk delete selected groups.
- `GET /group/search` – Search groups.

### **User API**
- `GET /user/fetch-table` – Get user table data.
- `GET /user/search` – Search users.
- `GET /user/get-chart-data` – Fetch user statistics for the chart.
- `POST /user/add-new-user` – Add a new user.
- `POST /user/edit-user/{id}` – Edit user details.
- `POST /user/single-delete/{id}` – Delete a single user.
- `POST /user/user-list-delete` – Bulk delete selected users.
- `POST /user-csv-file-download` – Download user data as a CSV file.

### **Other API**
- `POST /home/save` – Save data (usage not specified).
