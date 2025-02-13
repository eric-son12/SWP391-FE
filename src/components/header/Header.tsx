import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useFormik } from "formik";

import { useStore } from "../../store";

import "./Header.scss";

interface IChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Header: React.FC = () => {
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const changePassword = useStore((store) => store.changePassword);
  const role = localStorage.getItem("role");

  const navigate = useNavigate();
  const logout = useStore((store) => store.logout);
  // const setSearchKeyword = useStore((store) => store.setSearchKeyword);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik<IChangePasswordForm>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .required("Please confirm your new password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
    onSubmit: (values: any) => {
      changePassword(values.oldPassword, values.newPassword);
    },
  });

  return (
    <>
      <nav className="header">
        <div className="branch-wrap" onClick={() => navigate("/")}>
          <img src="/beauty-logo.svg" alt="" />
          <h4>Beauty-SC</h4>
        </div>

        <div className="searchbar-wrap">
          <TextField
            color="info"
            size="small"
            style={{ color: "white", fontSize: "14px" }}
            placeholder="Tìm kiếm bài viết..."
            variant="outlined"
            // onChange={(e) => setSearchKeyword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div className="action-group-wrap">
          {(role === "ROLE_VOLUNTEER" || role === "ROLE_ADMIN") && (
            <IconButton
              style={{ color: "white", marginRight: "8px" }}
              onClick={() => navigate("/admin/dashboard")}
            >
              <AdminPanelSettingsIcon />
            </IconButton>
          )}
          <IconButton
            style={{ color: "white", marginRight: "8px" }}
            onClick={() => navigate("/notification")}
          >
            <NotificationsNoneOutlinedIcon />
          </IconButton>
          <IconButton
            style={{ color: "white", marginRight: "8px" }}
            onClick={() => navigate("/listing")}
          >
            <ArticleOutlinedIcon />
          </IconButton>
          <Button
            variant="outlined"
            className="user-btn"
            startIcon={<PersonIcon />}
            id="basic-button"
            aria-controls={openMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            onClick={handleOpenMenu}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {token ? (
              <div>
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Change password
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </MenuItem>
              </div>
            ) : (
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  navigate("/login");
                }}
              >
                Login
              </MenuItem>
            )}
          </Menu>
          <Button
            style={{ background: "#222222" }}
            color="primary"
            variant="contained"
            startIcon={<DriveFileRenameOutlineOutlinedIcon />}
            onClick={() => navigate("/create-post")}
          >
            Đăng tin
          </Button>
        </div>
      </nav>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <form
            onSubmit={formik.handleSubmit}
            style={{ maxWidth: "400px", margin: "0 auto" }}
          >
            <TextField
              fullWidth
              id="oldPassword"
              name="oldPassword"
              label="Old Password"
              type="password"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
              }
              helperText={
                formik.touched.oldPassword && formik.errors.oldPassword
              }
              margin="normal"
            />
            <TextField
              fullWidth
              id="newPassword"
              name="newPassword"
              label="New Password"
              type="password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
              margin="normal"
            />
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              margin="normal"
            />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "16px" }}
            >
              Change Password
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="info">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
