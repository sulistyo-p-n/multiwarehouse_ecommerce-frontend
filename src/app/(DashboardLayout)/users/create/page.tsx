'use client';
import { Box, TextField, Typography, Divider, Stack, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Grid, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { IconArrowLeft, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Delete } from '@mui/icons-material';

interface UserEntity {
  username : string;
  email : string;
  password : string;
  active : boolean;
  role : string;
  adminWarehouse : UserAdminWarehouseEntity | null;
  profile : UserProfileEntity;
  addresses : Array<AddressEntity>;
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

export default function CreatePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<UserEntity>({
    username: "",
    email: "",
    password: "",
    active: false,
    role: "CUSTOMER",
    adminWarehouse: null,
    profile: {
      firstname: "",
      lastname: "",
      dateOfBirth: "",
      phoneNumber: "",
      profilePicture: "",
    },
    addresses: [],
  });

  const [warehouses, setWarehouses] = useState([]);

  const handleInputChange = (field : string, value : string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleProfileChange = (field: string, value: string) => {
    setFormData({
      ...formData, profile : { ...formData.profile!, [field]: value },
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, ["role"]: value });
    if (value != "WAREHOUSE_ADMIN") {
      setFormData({
        ...formData, adminWarehouse : null,
      });
    }
  };

  const handleAdminWarehouseChange = (value: string) => {
    setFormData({
      ...formData, adminWarehouse: { warehouseId: value },
    });
  };

  const handleAddressChange = (index: number, field: string, value: string) => {
    const updatedAddresses = formData.addresses?.map((address, i) =>
      i === index ? { ...address, [field]: value } : address
    );
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const removeAddress = (index: number) => {
    const updatedAddresses = formData.addresses?.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        { street: "", city: "", postalCode: "", latitude: 0.0, longitude: 0.0 },
      ],
    });
  };
  
  const handleOnSubmit = () => {
    postAPI();
  };

  const postAPI = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-type': 'application/json'
        }
      });
      const retrieveData = await res.json();
      console.log(retrieveData);
      if (res.status == 200) router.push("/users");
    } catch (err) {
      console.log(err);
    }
  }

  const getWarehousesAPI = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/warehouses?withInactive=true`);
      const retrieveData = await res.json();
      setWarehouses(retrieveData);
      console.log(retrieveData);
    } catch (err) { console.log(err); }
  }

  useEffect(() => {
    getWarehousesAPI();
  }, []);

  return (
    <PageContainer title="User - Create Page" description="this is User - Create Page">
      <DashboardCard title="User" subtitle="Create"  action={
        <Stack spacing={2} direction="row">
          <Button variant="outlined" size="medium" startIcon={<IconArrowLeft />} href="/users">Back</Button>
        </Stack>
        }>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                label="Username"
                fullWidth
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.active}
                    onChange={(e) => handleInputChange("active", e.target.checked)}
                  />
                }
                label="Active"
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
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
              >
                {[
                  { value: 'CUSTOMER', label: "Customer" },
                  { value: "SUPER_ADMIN", label: "Super Admin" },
                  { value: 'WAREHOUSE_ADMIN', label: "Warehouse Admin" },
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
                onChange={(e) => handleAdminWarehouseChange(e.target.value)}
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
                value={formData.profile.firstname}
                onChange={(e) => handleProfileChange("firstname", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={formData.profile.lastname}
                onChange={(e) => handleProfileChange("lastname", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formData.profile.dateOfBirth}
                onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={formData.profile.phoneNumber}
                onChange={(e) => handleProfileChange("phoneNumber", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Profile Picture URL"
                fullWidth
                value={formData.profile.profilePicture}
                onChange={(e) => handleProfileChange("profilePicture", e.target.value)}
              />
            </Grid>
          </Grid>

          {formData.addresses.length === 0 && (
          <>
            <Divider sx={{ marginY: 2 }}/>
            <Stack spacing={2} direction="row" display="flex" justifyContent="flex-end">
              <Button variant="outlined" size="small" startIcon={<IconPlus />} onClick={addAddress}>Add Address</Button>
            </Stack>
          </>
          )}

          {formData.addresses.map((address, index) => (
            <>
            <Divider sx={{ marginY: 2 }}/>
            <Grid container spacing={2} key={index}>
              <Grid item xs={12} md={12}>
                <TextField
                  label={`#${index + 1} Street`}
                  fullWidth
                  value={address.street}
                  onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  fullWidth
                  value={address.city}
                  onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Postal Code"
                  fullWidth
                  value={address.postalCode}
                  onChange={(e) => handleAddressChange(index, "postalCode", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Latitude"
                  fullWidth
                  value={address.latitude}
                  onChange={(e) => handleAddressChange(index, "latitude", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Longitude"
                  fullWidth
                  value={address.longitude}
                  onChange={(e) => handleAddressChange(index, "longitude", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" size="small" startIcon={<IconTrash />} onClick={() => removeAddress(index)} color='error'>Remove Address #{index + 1}</Button>
                {((formData.addresses.length - 1) === index) && (
                <Button variant="outlined" size="small" startIcon={<IconPlus />} onClick={addAddress}>Add Address</Button>
                )}
              </Grid>
            </Grid>
            </>
          ))}

          <Divider sx={{ marginY: 2 }}/>
          <Stack spacing={2} direction="row" display="flex" justifyContent="flex-end">
            <Button size="large" variant="contained" color="primary" onClick={handleOnSubmit}>Save</Button>
          </Stack>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
}
