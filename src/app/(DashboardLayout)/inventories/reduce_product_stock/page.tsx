'use client';
import { Box, TextField, Typography, Divider, Stack, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Grid, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { IconArrowLeft, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface InventoryReduceStockCommand {
  productId : string;
  quantity : number;
}

export default function CreatePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<InventoryReduceStockCommand>({
    productId: "",
    quantity: 0,
  });

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [activeSingleWarehouse, setActiveSingleWarehouse] = useState<boolean>(true);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const checkLoginUser = () => {
    if (typeof window !== 'undefined') {
      const localUser = localStorage.getItem("loginUser");
      const user = localUser ? JSON.parse(localUser) : {}
      
      if (user.role == "WAREHOUSE_ADMIN") {
        setActiveSingleWarehouse(true);
        setSelectedWarehouseId(user.adminWarehouse.warehouseId);
        return;
      }

      if (user.role != "SUPER_ADMIN") return;

      setActiveSingleWarehouse(false);
      const superAdminSelectedWarehouseId = localStorage.getItem("superAdminSelectedWarehouseId");
      if (superAdminSelectedWarehouseId) {
        setSelectedWarehouseId(superAdminSelectedWarehouseId);
      }
    }
  }

  const checkSelectedProductId = () => {
    if (typeof window !== 'undefined') {
      const selectedProductId = localStorage.getItem("selectedProductId");
      if (selectedProductId) {
        handleInputChange("productId", selectedProductId);
      }
    }
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

  const getProductsAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products?withInactive=true`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const retrieveData = await res.json();
      setProducts(retrieveData);
      console.log(retrieveData);
    } catch (err) { console.log(err); }
  }

  useEffect(() => {
    checkLoginUser();
    checkSelectedProductId();
    getWarehousesAPI();
    getProductsAPI();
  }, []);

  const handleWarehouseChange = (value: string) => {
    localStorage.setItem("superAdminSelectedWarehouseId", value);
    setSelectedWarehouseId(value);
  };

  const handleInputChange = (field : string, value : string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleOnSubmit = () => {
    postAPI();
  };

  const postAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventories/by_warehouse/${selectedWarehouseId}/reduce_product_stock`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const retrieveData = await res.json();
      console.log(retrieveData);
      if (res.status == 200) router.push("/inventories");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <PageContainer title="Inventory Stock - Reduce Page" description="this is Inventory Stock - Reduce Page">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <DashboardCard title="Inventory" subtitle="Warehouse"
              action = { warehouses.length > 0 && (
              <TextField
                style = {{width: 400}}
                select
                label={selectedWarehouseId ? "" : "Select Warehouse"}
                inputProps={ { readOnly: activeSingleWarehouse } }
                value={selectedWarehouseId || ""}
                onChange={(e) => handleWarehouseChange(e.target.value)}
              >
                {warehouses.map((option) => (
                  <MenuItem key={option["id"]} value={option["id"]}>
                    {option["name"]}
                  </MenuItem>
                ))}
              </TextField>
              )}
              />
          </Grid>

          <Grid item xs={12} lg={12}>
            <DashboardCard title="Stock" subtitle="Reduce"  action={
              <Stack spacing={2} direction="row">
                <Button variant="outlined" size="medium" startIcon={<IconArrowLeft />} href="/inventories">Back</Button>
              </Stack>
              }>
              <Box>
                <Grid container spacing={2}>

                  <Grid item xs={12} md={12}>
                    <TextField
                      select
                      label="Product"
                      fullWidth
                      value={formData.productId || ""}
                      onChange={(e) => handleInputChange("productId", e.target.value)}
                    >
                      {products.map((option) => (
                        <MenuItem key={option["id"]} value={option["id"]}>
                          {option["name"]}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={12}>
                    <TextField
                      label="Quantity"
                      fullWidth
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ marginY: 2 }}/>
                <Stack spacing={2} direction="row" display="flex" justifyContent="flex-end">
                  <Button size="large" variant="contained" color="primary" onClick={handleOnSubmit}>Save</Button>
                </Stack>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
