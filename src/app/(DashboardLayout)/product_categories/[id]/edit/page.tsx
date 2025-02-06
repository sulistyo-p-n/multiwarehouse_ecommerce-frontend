'use client';
import { Box, TextField, Typography, Divider, Stack, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { IconArrowLeft, IconRefresh } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from "notistack";

interface ProductCategoryEntity {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  active?: boolean;
}

export default function EditPage({
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
      const message = "Internal Server Error";
      console.log(message);
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  const putAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const id = (await params).id;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product_categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const currentData = await res.json();
      console.log(currentData);
      if (res.status == 200) {
        enqueueSnackbar("Product Category Updated", { variant: "success" });
        router.push("/product_categories");
      } else {
        const message = currentData.message || "Internal Server Error";
        console.log(message);
        enqueueSnackbar(message, { variant: "error" });
      }
    } catch (err) {
      const message = "Internal Server Error";
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

	const onSubmit = () => {
    putAPI();
  };

  useEffect(() => {
    getAPI();
  }, []);

  return (
    <PageContainer title="Product Category - Edit Page" description="this is Product Category - Edit Page">
      <DashboardCard title="Product Category" subtitle="Edit"  action={
        <Stack spacing={2} direction="row">
          <Button variant="text" size="medium" startIcon={<IconRefresh />} onClick={getAPI}>Refresh</Button>
          <Button variant="outlined" size="medium" startIcon={<IconArrowLeft />} href="/product_categories">Back</Button>
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
          <Stack spacing={2} direction="row" display="flex" justifyContent="flex-end">
            <Button size="large" variant="contained" color="primary" onClick={onSubmit}>Save</Button>
          </Stack>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
}
