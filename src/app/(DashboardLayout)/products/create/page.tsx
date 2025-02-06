'use client';
import { Box, TextField, Typography, Divider, Stack, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Grid, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { IconArrowLeft, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from "notistack";

interface ProductEntity {
  code : string;
  name : string;
  description : string;
  price : number;
  active : boolean;
  categoryId : string;
  images : Array<ProductImageEntity>;
}

interface ProductImageEntity {
  name : string;
  description : string;
  path : string;
  front : boolean;
  active : boolean;
}

export default function CreatePage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
  const [formData, setFormData] = useState<ProductEntity>({
    code: "",
    name: "",
    description: "",
    price: 0,
    active: false,
    categoryId: "",
    images: [],
  });

  const [productCategories, setProductCategories] = useState([]);

  const handleInputChange = (field : string, value : string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (index: number, field: string, value: string | boolean) => {
    const updatedImages = formData.images.map((image, i) =>
      i === index ? { ...image, [field]: value } : image
    );
    setFormData({ ...formData, images: updatedImages });
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [
        ...formData.images,
        { name: "", description: "", path: "", front: false, active: true},
      ],
    });
  };
  
  const handleOnSubmit = () => {
    postAPI();
  };

  const postAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const currentData = await res.json();
      console.log(currentData);
      if (res.status == 200) {
        enqueueSnackbar("Product Created", { variant: "success" });
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

  const getProductCategoriesAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product_categories?withInactive=true`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const retrieveData = await res.json();
      setProductCategories(retrieveData);
      console.log(retrieveData);
    } catch (err) { console.log(err); }
  }

  useEffect(() => {
    getProductCategoriesAPI();
  }, []);

  return (
    <PageContainer title="Product - Create Page" description="this is Product - Create Page">
      <DashboardCard title="Product" subtitle="Create"  action={
        <Stack spacing={2} direction="row">
          <Button variant="outlined" size="medium" startIcon={<IconArrowLeft />} href="/products">Back</Button>
        </Stack>
        }>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                label="Code"
                fullWidth
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                maxRows={6}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                select
                label="Category"
                fullWidth
                value={formData.categoryId || ""}
                onChange={(e) => handleInputChange("categoryId", e.target.value)}
              >
                {productCategories.map((option) => (
                  <MenuItem key={option["id"]} value={option["id"]}>
                    {option["name"]}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={12}>
              <TextField
                label="Price"
                fullWidth
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
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

          {formData.images.length === 0 && (
          <>
            <Divider sx={{ marginY: 2 }}/>
            <Stack spacing={2} direction="row" display="flex" justifyContent="flex-end">
              <Button variant="outlined" size="small" startIcon={<IconPlus />} onClick={addImage}>Add Image</Button>
            </Stack>
          </>
          )}

          {formData.images.map((image, index) => (
            <>
            <Divider sx={{ marginY: 2 }}/>
            <Grid container spacing={2} key={index}>
              <Grid item xs={12} md={12}>
                <TextField
                  label={`#${index + 1} Image Name`}
                  fullWidth
                  value={image.name}
                  onChange={(e) => handleImageChange(index, "name", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`#${index + 1} Image Description`}
                  fullWidth
                  value={image.description}
                  onChange={(e) => handleImageChange(index, "description", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`#${index + 1} Image Path`}
                  fullWidth
                  value={image.path}
                  onChange={(e) => handleImageChange(index, "path", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={image.front}
                      onChange={(e) => handleImageChange(index, "front", e.target.checked)}
                    />
                  }
                  label={`#${index + 1} Image isFront`}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={image.active}
                      onChange={(e) => handleImageChange(index, "active", e.target.checked)}
                    />
                  }
                  label={`#${index + 1} Image isActive`}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" size="small" startIcon={<IconTrash />} onClick={() => removeImage(index)} color='error'>Remove Image #{index + 1}</Button>
                {((formData.images.length - 1) === index) && (
                <Button variant="outlined" size="small" startIcon={<IconPlus />} onClick={addImage}>Add Image</Button>
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
