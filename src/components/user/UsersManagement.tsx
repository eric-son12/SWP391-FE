import React, { useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Container, Tooltip, IconButton } from "@mui/material";
import { useStore } from "../../store";
import { UserProfile } from "../../models/user";
import { Delete, Edit } from "@mui/icons-material";

const UsersManagement: React.FC = () => {
  const users = useStore((store) => store.users.users);
  const { fetchUsers } = useStore()

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <Typography variant="h5" mb={2}>Quản lý Users</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>user name</TableCell>
            <TableCell>Full name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users && users.map((user: UserProfile) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton> {/* onClick={() => handleEdit(user)} */}
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton> {/* onClick={() => handleDelete(user.id)} */}
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
            </TableRow>
          ))}
          {!users.length && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersManagement;
