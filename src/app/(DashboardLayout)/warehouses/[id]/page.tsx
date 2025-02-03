'use client';
import { Box, TextField, Divider, Stack, Button, Chip } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { IconArrowLeft, IconRefresh, IconSquareX, IconTrash, IconX } from '@tabler/icons-react';
import { notFound, useRouter } from 'next/navigation';

interface WarehouseEntity {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  active?: boolean;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  }
  softDeleted?: boolean;
}

export default function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter();
  const [data, setData] = useState<WarehouseEntity>({});

  const getAPI = async () => {
    try {
      const id = (await params).id;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/warehouses/${id}`);
      const currentData = await res.json();
      console.log(currentData);
      if (res.status == 200) setData(currentData);
      else router.push("/404");
    } catch (err) {
      console.log(err);
    }
  };

  const softDeleteAPI = async () => {
    try {
      const id = (await params).id;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/warehouses/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({}),
        headers: {
            'Content-type': 'application/json'
        }
      });
      const currentData = await response.json();
      console.log(currentData);
      return currentData;
    } catch (err) {
      console.log(err);
    }
  }

  const hardDeleteAPI = async () => {
    try {
      const id = (await params).id;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/warehouses/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          "forceDelete": true
        }),
        headers: {
            'Content-type': 'application/json'
        }
      });
      const currentData = await response.json();
      console.log(currentData);
      return currentData;
    } catch (err) {
      console.log("error : " + err);
    }
  }

  const deleteOnSubmit = async () => {
    const id = (await params).id;
    const result = (data.softDeleted!) ? (await hardDeleteAPI()) : (await softDeleteAPI());
    if (result) {
      router.push("/warehouses");
    }
  }

  useEffect(() => {
    getAPI();
  }, []);

  return (
    <PageContainer title="Warehouse - Detail Page" description="this is Warehouse - Detail Page">
      <DashboardCard title="Warehouse" subtitle="Detail"  action={
        <Stack spacing={2} direction="row">
          <Button variant="text" size="medium" startIcon={<IconRefresh />} onClick={getAPI}>Refresh</Button>
          <Button variant="outlined" size="medium" startIcon={<IconArrowLeft />} href="/warehouses">Back</Button>
        </Stack>
        }>
        <Box>
          {(data.softDeleted!) ? <Divider sx={{ marginY: 2 }}><Chip color="error" icon={<IconTrash />} label="already Soft Deleted!" /></Divider> : "" }
          <Box>
            <TextField
                fullWidth
                margin="normal"
                label={"Code"}
                value={data.code || ""}
                inputProps={
                    { readOnly: true }
                }
            />
            <TextField
                fullWidth
                margin="normal"
                label={"Name"}
                value={data.name || ""}
                inputProps={
                    { readOnly: true }
                }
            />
            <TextField
                fullWidth
                margin="normal"
                multiline
                maxRows={6}
                label={"Description"}
                value={data.description || ""}
                inputProps={
                    { readOnly: true }
                }
            />
            <TextField
                fullWidth
                margin="normal"
                label={"isActive"}
                value={data.active ? "Active" : "Inactive"}
                inputProps={
                    { readOnly: true }
                }
            />
          </Box>
          <Divider sx={{ marginY: 2 }}/>
          <Box>
            <TextField
                fullWidth
                margin="normal"
                multiline
                maxRows={4}
                label={"Street"}
                value={data.address?.street || ""}
                inputProps={
                    { readOnly: true }
                }
            />
            <TextField
                fullWidth
                margin="normal"
                label={"City"}
                value={data.address?.city || ""}
                inputProps={
                    { readOnly: true }
                }
            />
            <TextField
                fullWidth
                margin="normal"
                label={"Postal Code"}
                value={data.address?.postalCode || ""}
                inputProps={
                    { readOnly: true }
                }
            />
            <TextField
                fullWidth
                margin="normal"
                label={"Latitude"}
                value={data.address?.latitude || ""}
                inputProps={
                    { readOnly: true }
                }
            />
            <TextField
                fullWidth
                margin="normal"
                label={"Longitude"}
                value={data.address?.longitude || ""}
                inputProps={
                    { readOnly: true }
                }
            />
          </Box>
          <Divider sx={{ marginY: 2 }}/>
          <Stack spacing={2} direction="row" display="flex" justifyContent="flex-end">
            <Button size="large" variant="outlined" color="error" startIcon={(data.softDeleted!) ? <IconX /> : <IconTrash /> } onClick={deleteOnSubmit}>{(data.softDeleted!) ? "Hard Delete!" : "Delete" }</Button>
          </Stack>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
}
