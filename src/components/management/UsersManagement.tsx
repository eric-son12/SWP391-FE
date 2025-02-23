import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridRenderCellParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useStore } from '../../store';
import { UserProfile } from '../../models/user';

const UpdatePatientProfile: React.FC = () => {
  const { allUsers } = useStore((state) => state.profile);
  const fetchAllUsers = useStore((state) => state.fetchAllUsers);
  const updateUser = useStore((state) => state.updateProfile);
  const deleteUser = useStore((state) => state.deleteUser);

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const { control, handleSubmit, reset } = useForm<UserProfile>();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleOpenModal = (user: UserProfile, mode: 'view' | 'edit') => {
    setSelectedUser(user);
    setModalMode(mode);
    reset(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const onSubmit = (data: UserProfile) => {
    updateUser(data).then(() => {
      handleCloseModal();
      fetchAllUsers();
    });
  };

  const handleDeleteUser = (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(String(id)).then(() => {
        fetchAllUsers();
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "Avatar",
      width: 100,
      renderCell: (params: GridRenderCellParams<any>) => (
        <img
          src={params.value || "https://placehold.co/50"}
          alt="avatar"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    { field: "username", headerName: "Username", width: 150 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "birthDate", headerName: "DOB", width: 130 },
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (params: GridRenderCellParams<any>) => (
        <>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenModal(params.row, "view")}
            style={{ marginRight: 8 }}
          >
            View
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenModal(params.row, "edit")}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDeleteUser(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 25,
    page: 0,
  });
  
  return (
    <div className="update-patient-container">
      <h2>Patient Management</h2>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={allUsers}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[25, 50, 100]}
          sx={{ border: 0 }}
        />
      </Paper>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="update-patient-modal">
          <h3>{modalMode === 'edit' ? "Edit User" : "View User"}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <TextField
                label="Full Name"
                variant="outlined"
                {...control.register("fullName")}
                slotProps={{
                  input: {
                    readOnly: modalMode === 'view'
                  }
                }}
                fullWidth
              />
            </div>
            <div className="form-group">
              <TextField
                label="Username"
                variant="outlined"
                {...control.register("username")}
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
                fullWidth
              />
            </div>
            <div className="form-group">
              <Controller
                name="dob"
                control={control}
                render={({ field }) => {
                  const dateValue = field.value
                    ? dayjs(field.value)
                    : null;

                  return (
                    <DatePicker
                      label="Date of Birth"
                      value={dateValue}
                      onChange={(newValue) => {
                        field.onChange(
                          newValue ? newValue.format("YYYY-MM-DD") : ""
                        );
                      }}
                      readOnly={modalMode === "view"}
                      slotProps={{
                        textField: { fullWidth: true },
                      }}
                    />
                  );
                }}
              />

            </div>
            {modalMode === 'edit' && (
              <div className="form-group">
                <Button type="submit" variant="contained" fullWidth>
                  Save
                </Button>
              </div>
            )}
          </form>
          {modalMode === 'view' && (
            <div className="form-group">
              <Button variant="outlined" onClick={handleCloseModal} fullWidth>
                Close
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UpdatePatientProfile;
