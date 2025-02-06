'use client';
import { Box, TextField, Typography, Divider, Stack, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { IconArrowLeft, IconRefresh } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from "notistack";

interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

interface WarehouseEntity {
  code?: string;
  name?: string;
  description?: string;
  active?: boolean;
  address?: Address;
}

export default function CreatePage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
      
  const [data, setData] = useState<WarehouseEntity>({active: true});
  const [address, setAddress] = useState<Address>({});

  const postAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/warehouses`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Authorization': 'Bearer ' + user.token,
            'Content-type': 'application/json'
        }
      });
      const currentData = await response.json();
      console.log(currentData);
      if (response.status == 200) {
        enqueueSnackbar("Warehouse Created", { variant: "success" });
        router.push("/warehouses");
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

  const codeOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setData((prevData) => ({ ...prevData, code: event.target.value }));
  }

  const nameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevData) => ({ ...prevData, name: event.target.value }));
  }

  const descriptionOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevData) => ({ ...prevData, description: event.target.value }));
  }

  const isActiveOnChange = (event: SelectChangeEvent) => {
    setData((prevData) => ({ ...prevData, active: (event.target.value == "true") }));
  };

  const addressStreetOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setAddress((prevData) => ({ ...prevData, street: event.target.value }));
    setData((prevData) => ({ ...prevData, address: address }));
  }

  const addressCityOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setAddress((prevData) => ({ ...prevData, city: event.target.value }));
    setData((prevData) => ({ ...prevData, address: address }));
  }

  const addressPostalCodeOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setAddress((prevData) => ({ ...prevData, postalCode: event.target.value }));
    setData((prevData) => ({ ...prevData, address: address }));
  }

  const addressLatitudeOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setAddress((prevData) => ({ ...prevData, latitude: Number(event.target.value) }));
    setData((prevData) => ({ ...prevData, address: address }));
  }

  const addressLongitudeOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setAddress((prevData) => ({ ...prevData, longitude: Number(event.target.value) }));
    setData((prevData) => ({ ...prevData, address: address }));
  }

	const onSubmit = () => {
    postAPI();
  };

  return (
    <PageContainer title="Warehouse - Create Page" description="this is Warehouse - Create Page">
      <DashboardCard title="Warehouse" subtitle="Create"  action={
        <Stack spacing={2} direction="row">
          <Button variant="outlined" size="medium" startIcon={<IconArrowLeft />} href="/warehouses">Back</Button>
        </Stack>
        }>
        <Box>
          <Box>
            <TextField
                fullWidth
                margin="normal"
                label={"Code"}
                value={data.code || ""}
                onChange={codeOnChange}
            />
            <TextField
                fullWidth
                margin="normal"
                label={"Name"}
                value={data.name || ""}
                onChange={nameOnChange}
            />
            <TextField
                fullWidth
                margin="normal"
                multiline
                maxRows={6}
                label={"Description"}
                value={data.description || ""}
                onChange={descriptionOnChange}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id={"id_select_" + "isActive"}>isActive</InputLabel>
                <Select
                    labelId={"id_" + "isActive"}
                    id={"id_select_helper_" + "isActive"}
                    value={data.active ? "true" : "false"}
                    label={"isActive"}
                    onChange={isActiveOnChange}
                >
                    <MenuItem value={"true"}>Active</MenuItem>
                    <MenuItem value={"false"}>Inactive</MenuItem>
                </Select>
            </FormControl>
          </Box>
          <Divider sx={{ marginY: 2 }}/>
          <Box>
            <TextField
                fullWidth
                margin="normal"
                multiline
                maxRows={4}
                label={"Street"}
                value={address.street || ""}
                onChange={addressStreetOnChange}
            />
            <TextField
                fullWidth
                margin="normal"
                label={"City"}
                value={address.city || ""}
                onChange={addressCityOnChange}
            />
            <TextField
                fullWidth
                margin="normal"
                label={"Postal Code"}
                value={address.postalCode || ""}
                onChange={addressPostalCodeOnChange}
            />
            <TextField
                fullWidth
                margin="normal"
                label={"Latitude"}
                value={address.latitude || ""}
                onChange={addressLatitudeOnChange}
            />
            <TextField
                fullWidth
                margin="normal"
                label={"Longitude"}
                value={address.longitude || ""}
                onChange={addressLongitudeOnChange}
            />
          </Box>
          <Divider sx={{ marginY: 2 }}/>
          <Stack spacing={2} direction="row" display="flex" justifyContent="flex-end">
            <Button size="large" variant="contained" color="primary" onClick={onSubmit}>Save</Button>
          </Stack>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
}
