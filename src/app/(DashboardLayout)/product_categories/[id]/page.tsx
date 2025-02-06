'use client';
import { Box, TextField, Divider, Stack, Button, Chip } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { IconArrowLeft, IconRefresh, IconSquareX, IconTrash, IconX } from '@tabler/icons-react';
import { notFound, useRouter } from 'next/navigation';
import { useSnackbar } from "notistack";

interface ProductCategoryEntity {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  active?: boolean;
  isSoftDeleted?: boolean;
}

export default function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<ProductCategoryEntity>({});

  const getAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const id = (await params).id;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product_categories/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const currentData = await res.json();
      console.log(currentData);
      if (res.status == 200) setData(currentData);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product_categories/${id}`, {
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
        enqueueSnackbar("Product Category Soft Deleted", { variant: "success" });
        router.push("/product_categories");
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product_categories/${id}`, {
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
        enqueueSnackbar("Product Category Hard Deleted", { variant: "success" });
        router.push("/product_categories");
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
    (data.isSoftDeleted!) ? (await hardDeleteAPI()) : (await softDeleteAPI());
  }

  useEffect(() => {
    getAPI();
  }, []);

  return (
    <PageContainer title="Product Category - Detail Page" description="this is Product Category - Detail Page">
      <DashboardCard title="Product Category" subtitle="Detail"  action={
        <Stack spacing={2} direction="row">
          <Button variant="text" size="medium" startIcon={<IconRefresh />} onClick={getAPI}>Refresh</Button>
          <Button variant="outlined" size="medium" startIcon={<IconArrowLeft />} href="/product_categories">Back</Button>
        </Stack>
        }>
        <Box>
          {(data.isSoftDeleted!) ? <Divider sx={{ marginY: 2 }}><Chip color="error" icon={<IconTrash />} label="already Soft Deleted!" /></Divider> : "" }
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
          <Stack spacing={2} direction="row" display="flex" justifyContent="flex-end">
            <Button size="large" variant="outlined" color="error"
            startIcon={(data.isSoftDeleted!) ? <IconX /> : <IconTrash /> }
            onClick={deleteOnSubmit}>
              {(data.isSoftDeleted!) ? "Hard Delete!" : "Delete" }
            </Button>
          </Stack>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
}
