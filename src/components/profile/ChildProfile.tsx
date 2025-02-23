import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import {useStore} from "../../store";
import "./Profile.scss";

interface ChildFormInputs {
  id?: number;
  fullName: string;
  dob: string;
  gender: string;
  avatar?: string;
}

const ChildProfile = () => {
  const {children} = useStore((state) => state.profile);
  const fetchMyChildren = useStore((state) => state.fetchMyChildren);
  const createChild = useStore((state) => state.createChild);
  const updateMyChild = useStore((state) => state.updateMyChild);
  const [open, setOpen] = useState(false);
  const [editChild, setEditChild] = useState<ChildFormInputs | null>(null);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ChildFormInputs>();

  useEffect(() => {
    fetchMyChildren();
  }, [fetchMyChildren]);

  const handleOpen = () => {
    setEditChild(null);
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setEditChild(null);
  };

  const onSubmit = (data: ChildFormInputs) => {
    if (editChild) {
      updateMyChild(data);
    } else {
      createChild(data);
    }
    handleClose();
  };

  const handleEdit = (child: ChildFormInputs) => {
    setEditChild(child);
    reset(child);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    // Giả sử bạn có function deleteChild trong store
    console.log("Deleting child", id);
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
    { field: "fullName", headerName: "Full Name", width: 150 },
    { field: "dob", headerName: "Date of Birth", width: 130 },
    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => (
        <>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEdit(params.row)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="child-profile-container">
      <p className="child-profile-title">Child Profile</p>
      <Button variant="contained" className="child-profile-add-button" onClick={handleOpen}>
        Add Child
      </Button>
      <Paper style={{ height: 400, width: "100%", marginTop: 20 }}>
        <DataGrid
          rows={children}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
      <Modal open={open} onClose={handleClose}>
        <div className="child-profile-modal">
          <p className="child-profile-title">
            {editChild ? "Edit Child" : "Add New Child"}
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="child-profile-form-group">
              <TextField
                label="Full Name"
                variant="outlined"
                {...register("fullName", { required: "Required" })}
                placeholder="Full Name"
                error={!!errors.fullName}
                helperText={errors.fullName ? errors.fullName.message : ""}
                fullWidth
              />
            </div>
            <div className="child-profile-form-group">
              <Controller
                name="dob"
                control={control}
                rules={{ required: "Required" }}
                render={({ field: { onChange, value} }) => (
                  <DatePicker
                    label="Date of Birth"
                    format="DD/MM/YYYY"
                    onChange={(date) => onChange(date ? date.toDate() : null)}
                    value={value ? dayjs(value) : null}
                  />
                )}
              />
            </div>
            <div className="child-profile-form-group">
              <TextField
                label="Gender"
                variant="outlined"
                {...register("gender", { required: "Required" })}
                placeholder="Gender"
                error={!!errors.gender}
                helperText={errors.gender ? errors.gender.message : ""}
                fullWidth
              />
            </div>
            <div className="child-profile-form-group">
              <TextField
                label="Avatar URL"
                variant="outlined"
                {...register("avatar")}
                placeholder="Avatar URL"
                fullWidth
              />
            </div>
            <Button type="submit" variant="contained" className="child-profile-submit-button">
              {editChild ? "Update" : "Create"}
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ChildProfile;
