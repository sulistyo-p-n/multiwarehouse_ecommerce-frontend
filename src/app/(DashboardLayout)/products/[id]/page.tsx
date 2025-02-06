'use client';
import { Box, TextField, Divider, Stack, Button, Chip, Grid, FormControlLabel, Checkbox, MenuItem } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { IconArrowLeft, IconRefresh, IconSquareX, IconTrash, IconX } from '@tabler/icons-react';
import { notFound, useRouter } from 'next/navigation';
import { useSnackbar } from "notistack";

interface ProductEntity {
  id? : string;
  code? : string;
  name? : string;
  description? : string;
  price? : number;
  active? : boolean;
  category? : ProductCategoryEntity;
  images? : Array<ProductImageEntity>;
  quantity? : number;
  softDeleted? : boolean;
}

interface ProductCategoryEntity {
  id : string;
  code : string;
  name : string;
  description : string;
  active : boolean;
  isSoftDeleted : boolean;
}

interface ProductImageEntity {
  id : string;
  name : string;
  description : string;
  path : string;
  front : boolean;
  active : boolean;
}

export default function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState<ProductEntity>({});

  const isSoftDeleted = () => {
    return formData.softDeleted ?? false;
  }

  const getAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const id = (await params).id;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const retrieveData = await res.json();
      console.log(retrieveData);
      if (res.status == 200) setFormData(retrieveData);
      else {
        router.push("/404");
      }
    } catch (err) {
      const message = "Internal Server Error";
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`, {
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
        enqueueSnackbar("Product Soft Deleted", { variant: "success" });
        router.push("/products");
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

  const hardDeleteAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const id = (await params).id;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`, {
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
        enqueueSnackbar("Product Hard Deleted", { variant: "success" });
        router.push("/products");
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

  const deleteOnSubmit = async () => {
    const id = (await params).id;
    (isSoftDeleted()) ? (await hardDeleteAPI()) : (await softDeleteAPI());
  }

  useEffect(() => {
    getAPI();
  }, []);

  return (
    <PageContainer title="Product - Detail Page" description="this is Product - Detail Page">
      <DashboardCard title="Product" subtitle="Detail"  action={
        <Stack spacing={2} direction="row">
          <Button variant="text" size="medium" startIcon={<IconRefresh />} onClick={getAPI}>Refresh</Button>
          <Button variant="outlined" size="medium" startIcon={<IconArrowLeft />} href="/products">Back</Button>
        </Stack>
        }>
        <Box>
          {isSoftDeleted() ? <Divider sx={{ marginY: 2 }}><Chip color="error" icon={<IconTrash />} label="already Soft Deleted!" /></Divider> : "" }
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                label="Code"
                fullWidth
                value={formData.code || ""}
                inputProps={ { readOnly: true } }
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name || ""}
                inputProps={ { readOnly: true } }
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                maxRows={6}
                value={formData.description || ""}
                inputProps={ { readOnly: true } }
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="Category"
                fullWidth
                value={formData.category?.name || ""}
                inputProps={ { readOnly: true } }
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="Price"
                fullWidth
                value={formData.price || ""}
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

          {formData.images?.map((image, index) => (
            <>
            <Divider sx={{ marginY: 2 }}/>
            <Grid container spacing={2} key={index}>
              <Grid item xs={12} md={12}>
                <TextField
                  label={`#${index + 1} Image Name`}
                  fullWidth
                  value={image.name}
                inputProps={ { readOnly: true } }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`#${index + 1} Image Description`}
                  fullWidth
                  value={image.description}
                  inputProps={ { readOnly: true } }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`#${index + 1} Image Path`}
                  fullWidth
                  value={image.path}
                  inputProps={ { readOnly: true } }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`#${index + 1} Image isFront`}
                  fullWidth
                  value={image.front ? "Front" : "Not Front"}
                  inputProps={ { readOnly: true } }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`#${index + 1} Image isActive`}
                  fullWidth
                  value={image.active ? "Active" : "Inactive"}
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
