// UserProfile.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Container,
  Card,
  Divider,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2"
import { Email, Lock } from '@mui/icons-material';
import { useStore } from "../../store";

interface ParentInfo {
  id: string;
  username: string;
  fullName: string;
  role: "PARENT";
}

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  dob: string;
  gender: string;
  role: "CHILD" | "PARENT" | "STAFF" | "ADMIN";
  parent?: ParentInfo;
  email: string;
  avatar: string;
}

const dummyUser = {
  userId: 1001,
  parent: {
    userId: 1002,
    username: "janedoe",
    fullname: "Jane Doe",
    password: "password123",
    email: "janedoe@example.com",
    phone: "0123456789",
    birthDate: new Date("1975-08-20"),
    gender: "FEMALE",
    role: "PARENT",
    avatar: "https://via.placeholder.com/90",
  },
  username: "johndoe",
  fullname: "John Doe",
  password: "123456",
  email: "johndoe@example.com",
  phone: "0987654321",
  birthDate: new Date("1985-06-15"),
  gender: "MALE",
  role: "CHILD",
  avatar: "https://via.placeholder.com/100",
};

const UserProfileLayout: React.FC = () => {
  const user = dummyUser; //useStore((state) => state.users?.user);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5">User not found</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flexGrow: 1, padding: 3}}>
        <Container maxWidth="md">
          <Grid sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={12} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={user.avatar || 'https://hwchamber.co.uk/testimonial-layout-test/avatar-placeholder/'} sx={{ width: 100, height: 100 }}>
                </Avatar>
                <Box>
                  <Typography variant="h4">{user.fullname}</Typography>
                  <Typography color="text.secondary">ID: {user.userId}</Typography>
                </Box>
              </Grid>

              <Grid size={12}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid columns={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="Username" value={user.username} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid columns={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="Full Name" value={user.fullname} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid columns={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="Date of Birth" value={user.birthDate} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid columns={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="Gender" value={user.gender} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid columns={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="Role" value={user.role} InputProps={{ readOnly: true }} />
                  </Grid>
                </Grid>
              </Grid>

              {user.role === "CHILD" && user.parent && (
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>Parent Information</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid columns={{ xs: 12, md: 6 }}>
                      <TextField fullWidth label="Parent Name" value={user.parent.fullname} InputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid columns={{ xs: 12, md: 6 }}>
                      <TextField fullWidth label="Parent ID" value={user.parent.userId} InputProps={{ readOnly: true }} />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              <Grid size={12}>
                <Typography variant="h6" gutterBottom>Private Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid columns={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={user.email}
                      InputProps={{
                        readOnly: true,
                        startAdornment: <Email style={{ marginRight: 8 }} />,
                      }}
                    />
                  </Grid>
                  <Grid columns={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Password"
                      value="********"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <Lock style={{ marginRight: 8 }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default UserProfileLayout;
