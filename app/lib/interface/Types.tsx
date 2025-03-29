//signin.tsx
export interface LoginData {
    email: string;
    password: string;
  }
  //store.tsx
  export interface AuthUser {
    email: string;
    token: string;
    role: string;
  }
 //forgotpassword.tsx 
export interface Forgot{
    email:string;
}
//GetProfile.tsx
export interface ProfileData {
  id: number;
  email: string;
  fname: string;
  lname: string;
  phone_number: string;
  profile_pic?: string | null;
  user_type: string;
}

export interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: ProfileData;
}
//Layout.tsx
export interface LayoutAuthState {
  user: {
    email: string;
    role: "user" | "admin";
  };
}

//resetpassword.tsx
export interface ResetPasswordData {
  new_password: string;
  confirm_new_password: string;
  reset_password_token: string;
}
//UPdatePassword.tsx
export interface UpdatePasswordData{
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}
//addproject.tsx
export  interface ErrorState {
  title?: string;
  code?: string;
  description?: string;
}
//EditProjec.tsx
export interface Project {
  id: number;
  title: string;
  code: string;
  description: string;
  timezone: string;
}
export interface EditProjectProps {
  project: Project | null;
  onClose: () => void;
  onUpdate: () => void;
}
//GetMembers.tsx
export interface ProjectMember {
  id: number;
  fname: string;
  lname: string;
  role: string;
}
//getSingleProject.tsx
export interface Task{
    task_id: string;
    task_status: string;
    task_title: string;
    task_ref_id: string;
    task_priority: string;
  }
export interface TaskColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  moveTask: (id: string, fromStatus: string, toStatus: string) => void;
}
export interface UpdateTaskPayload {
  taskId: string;
  newStatus: string;
}
//Groups.tsx
export interface  ProjectGroup{
  projectId: string;
  groupId: number;
 
}
export interface Member{
  members?: { user_id: number; role: string }[];
}
//projectTable.tsx
export interface FetchProjectParams {
  page: number;
  pageSize: number;
  status?: string;
  search?: string;
  orderBy?: string;
}

//AddUser.tsx
export interface UserFormInputs {
  fname: string;
  lname: string;
  email: string;
  designation: string;
  password: string;
  user_type: string;
  phone_number: string;
}
//EditUserForm.tsx
export interface EditUserFormProps {
  project: {
    id: number;
    fname: string;
    lname: string;
    email: string;
    phone_number?: string;
    designation?: string;
    user_type?: string;
  };
  onClose: () => void;
  onUpdate: () => void;
}
export  interface ErrorState{
  fname?:string;
  lname?:string;
  email?:string;
}
//Usertable.tsx
export interface UserData {
  id: string;
  fname: string;
  lname: string;
  email: string;
  designation: string;
  phone_number: string;
  user_type: string;
  todo_count: number;
  in_progress_count: number;
  overdue_count: number;
  completed_count: number;
  active: boolean;
}


