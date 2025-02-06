'use client';
import { Box, TextField, Divider, Stack, Button, Chip, Grid, FormControlLabel, Checkbox, MenuItem } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { IconArrowLeft, IconRefresh, IconTrash, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from "notistack";
import moment from 'moment';

interface UserEntity {
  id? : string;
  username? : string;
  email? : string;
  active? : boolean;
  role? : String;
  adminWarehouse? : UserAdminWarehouseEntity;
  profile? : UserProfileEntity;
  addresses? : Array<AddressEntity>;
  isSoftDeleted? : boolean;
}

interface UserAdminWarehouseEntity {
  warehouseId : string;
}

interface UserProfileEntity {
  firstname : string;
  lastname : string;
  dateOfBirth : string;
  phoneNumber : string;
  profilePicture : string;
}

interface AddressEntity {
  street : string;
  city : string;
  postalCode : string;
  latitude : number;
  longitude : number;
}

export default function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState<UserEntity>({});

  const [warehouses, setWarehouses] = useState([]);

  const isSoftDeleted = () => {
    return formData.isSoftDeleted ?? false;
  }

  const getAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const id = (await params).id;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const retrieveData = await res.json();
      console.log(retrieveData);
      if (res.status == 200) setFormData(retrieveData);
      else router.push("/404");
    } catch (err) {
      const message = err?.message || "Internal Server Error";
      console.log(message);
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  const softDeleteAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const id = (await params).id;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({}),
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const currentData = await response.json();
      console.log(currentData);

      if (response.status == 200) {
        enqueueSnackbar("User Soft Deleted", { variant: "success" });
        router.push("/users");
      } else {
        const message = currentData.message || "Internal Server Error";
        console.log(message);
        enqueueSnackbar(message, { variant: "error" });
      }

    } catch (err) {
      const message = err?.message || "Internal Server Error";
      console.log(message);
      enqueueSnackbar(message, { variant: "error" });
    }
  }

  const hardDeleteAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const id = (await params).id;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          "forceDelete": true
        }),
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const currentData = await response.json();
      console.log(currentData);

      if (response.status == 200) {
        enqueueSnackbar("User Hard Deleted", { variant: "success" });
        router.push("/users");
      } else {
        const message = currentData.message || "Internal Server Error";
        console.log(message);
        enqueueSnackbar(message, { variant: "error" });
      }

    } catch (err) {
      const message = err?.message || "Internal Server Error";
      console.log(message);
      enqueueSnackbar(message, { variant: "error" });
    }
  }

  const deleteOnSubmit = async () => {
    const id = (await params).id;
    (isSoftDeleted()) ? (await hardDeleteAPI()) : (await softDeleteAPI());
  }

  const getWarehousesAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/warehouses?withInactive=true`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const retrieveData = await res.json();
      setWarehouses(retrieveData);
      console.log(retrieveData);
    } catch (err) { console.log(err); }
  }

  useEffect(() => {
    getAPI();
    getWarehousesAPI();
  }, []);

  return (
    <PageContainer title="User - Detail Page" description="this is User - Detail Page">
      <DashboardCard title="User" subtitle="Detail"  action={
        <Stack spacing={2} direction="row">
          <Button variant="text" size="medium" startIcon={<IconRefresh />} onClick={getAPI}>Refresh</Button>
          <Button variant="outlined" size="medium" startIcon={<IconArrowLeft />} href="/users">Back</Button>
        </Stack>
        }>
        <Box>
          {isSoftDeleted() ? <Divider sx={{ marginY: 2 }}><Chip color="error" icon={<IconTrash />} label="already Soft Deleted!" /></Divider> : "" }
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                label="Username"
                fullWidth
                value={formData.username || ""}
                inputProps={ { readOnly: true } }
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email || ""}
                inputProps={ { readOnly: true } }
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="isActive"
                fullWidth
                value={formData.active ? "Active" : "Inactive"}
                inputProps={ { readOnly: true } }
              />
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }}/>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Role"
                fullWidth
                value={formData.role || ""}
                inputProps={ { readOnly: true } }
              >
                {[
                  { value: "CUSTOMER", label: "Customer" },
                  { value: "SUPER_ADMIN", label: "Super Admin" },
                  { value: "WAREHOUSE_ADMIN", label: "Warehouse Admin" },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {formData.role === "WAREHOUSE_ADMIN" && (
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Warehouse"
                fullWidth
                value={formData.adminWarehouse?.warehouseId || ""}
                inputProps={ { readOnly: true } }
              >
                {warehouses.map((option) => (
                  <MenuItem key={option["id"]} value={option["id"]}>
                    {option["name"]}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            )}
          </Grid>

          <Divider sx={{ marginY: 2 }}/>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                fullWidth
                value={formData.profile?.firstname || ""}
                inputProps={ { readOnly: true } }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={formData.profile?.lastname || ""}
                inputProps={ { readOnly: true } }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={moment(formData.profile?.dateOfBirth).format('YYYY-MM-DD')}
                inputProps={ { readOnly: true } }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={formData.profile?.phoneNumber || ""}
                inputProps={ { readOnly: true } }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Profile Picture URL"
                fullWidth
                value={formData.profile?.profilePicture || ""   }
                inputProps={ { readOnly: true } }
              />
            </Grid>
          </Grid>

          {formData.addresses?.map((address, index) => (
            <>
            <Divider sx={{ marginY: 2 }}/>
            <Grid container spacing={2} key={index}>
              <Grid item xs={12} md={12}>
                <TextField
                  label={`#${index + 1} Street`}
                  fullWidth
                  value={address.street}
                inputProps={ { readOnly: true } }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  fullWidth
                  value={address.city}
                  inputProps={ { readOnly: true } }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Postal Code"
                  fullWidth
                  value={address.postalCode}
                  inputProps={ { readOnly: true } }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Latitude"
                  fullWidth
                  value={address.latitude}
                  inputProps={ { readOnly: true } }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Longitude"
                  fullWidth
                  value={address.longitude}
                  inputProps={ { readOnly: true } }
                />
              </Grid>
            </Grid>
            </>
          ))}

          <Divider sx={{ marginY: 2 }}/>
          <Stack spacing={2} direction="row" display="flex" justifyContent="flex-end">
            <Button size="large" variant="outlined" color="error" 
              startIcon={isSoftDeleted() ? <IconX /> : <IconTrash /> } 
              onClick={deleteOnSubmit}>
                {isSoftDeleted() ? "Hard Delete!" : "Delete" }
            </Button>
          </Stack>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
}
