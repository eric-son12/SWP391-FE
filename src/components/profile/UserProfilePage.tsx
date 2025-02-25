import React, { useEffect, useState } from "react";
import { Email, Lock } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import "./Profile.scss";
import { useStore } from "../../store";
import { UserProfile } from "../../models/user";

const UserProfilePage: React.FC = () => {
  const { myInfo } = useStore((state) => state.profile);
  const fetchMyInfo = useStore((state) => state.fetchMyInfo);
  const updateProfile = useStore((state) => state.updateProfile);

  const [editMode, setEditMode] = useState(false);

  const { control, handleSubmit, reset } = useForm<UserProfile>({
    defaultValues: myInfo || {},
  });

  useEffect(() => {
    fetchMyInfo();
  }, [fetchMyInfo]);

  useEffect(() => {
    if (myInfo) {
      reset(myInfo);
    }
  }, [myInfo, reset]);

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
    if (editMode) {
      reset(myInfo);
    }
  };

  const onSubmit = (data: UserProfile) => {
    updateProfile(data).then(() => {
      setEditMode(false);
    });
  };

  if (!myInfo) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          className="profile-avatar"
          src={myInfo.avatar || "https://commons.wikimedia.org/wiki/File:Portrait_Placeholder.png"}
          alt="avatar"
        />
        <div className="profile-name-container">
          <h1>{myInfo.fullName}</h1>
          <p>@{myInfo.username}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="profile-section">
          <p className="profile-section-title">Basic Information</p>
          <hr className="profile-divider" />
          <div className="profile-row">
            <div className="profile-column">
              {editMode ? (
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Full Name" variant="outlined" fullWidth />
                  )}
                />
              ) : (
                <TextField
                  label="Full Name"
                  variant="outlined"
                  value={myInfo.fullName}
                  slotProps={{ input: { readOnly: true } }}
                  fullWidth
                />
              )}
            </div>
            <div className="profile-column">
              {editMode ? (
                <Controller
                  name="dob"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      label="Date of Birth"
                      format="DD/MM/YYYY"
                      onChange={(date) => onChange(date ? date.toDate() : null)}
                      value={value ? dayjs(value) : null}
                    />
                  )}
                />
              ) : (
                <TextField
                  label="Date of Birth"
                  variant="outlined"
                  value={myInfo.dob}
                  slotProps={{ input: { readOnly: true } }}
                  fullWidth
                />
              )}
            </div>
          </div>
          <div className="profile-row">
            <div className="profile-column">
              {editMode ? (
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Gender" variant="outlined" fullWidth />
                  )}
                />
              ) : (
                <TextField
                  label="Gender"
                  variant="outlined"
                  value={myInfo.gender}
                  slotProps={{ input: { readOnly: true } }}
                  fullWidth
                />
              )}
            </div>
            <div className="profile-column">
              <TextField
                label="Role"
                variant="outlined"
                value={myInfo.role}
                slotProps={{ input: { readOnly: true } }}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Private Information */}
        <div className="profile-section">
          <p className="profile-section-title">Private Information</p>
          <hr className="profile-divider" />
          <div className="profile-row">
            <div className="profile-column">
              <TextField
                label="Email"
                variant="outlined"
                value={myInfo.email}
                slotProps={{
                  input: {
                    readOnly: true,
                    startAdornment: (
                      <span style={{ marginRight: 5 }}>
                        <Email style={{ fontSize: "1rem" }} />
                      </span>
                    ),
                  }
                }}
                fullWidth
              />
            </div>
            <div className="profile-column">
              <TextField
                label="Password"
                variant="outlined"
                value="********"
                type="password"
                slotProps={{
                  input: {
                    readOnly: true,
                    startAdornment: (
                      <span style={{ marginRight: 5 }}>
                        <Lock style={{ fontSize: "1rem" }} />
                      </span>
                    ),
                  }
                }}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Nút chuyển đổi edit mode */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {editMode ? (
            <>
              <Button type="submit" variant="contained" style={{ marginRight: "10px" }}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleEditToggle}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={handleEditToggle}>
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfilePage;
