'use client';
import { Box, Button, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { IconDetails, IconEdit, IconEye, IconMinus, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ListPage = () => {
  const router = useRouter();

  const [datas, setDatas] = useState<any>({});
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [activeSingleWarehouse, setActiveSingleWarehouse] = useState<boolean>(true);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const checkLoginUser = () => {
    if (typeof window !== 'undefined') {
      const localUser = localStorage.getItem("loginUser");
      const user = localUser ? JSON.parse(localUser) : {}
      
      if (user.role == "WAREHOUSE_ADMIN") {
        setActiveSingleWarehouse(true);
        setSelectedWarehouseId(user.adminWarehouse.warehouseId);
        callAPI(user.adminWarehouse.warehouseId);
        return;
      }
      else if (user.role == "SUPER_ADMIN") {
        setActiveSingleWarehouse(false);
        const superAdminSelectedWarehouseId = localStorage.getItem("superAdminSelectedWarehouseId");
        if (superAdminSelectedWarehouseId) {
          setSelectedWarehouseId(superAdminSelectedWarehouseId);
          callAPI(superAdminSelectedWarehouseId);
        }
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

  const callAPI = async (warehouseId : string) => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventories/by_warehouse/${warehouseId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const datas = await res.json();
      console.log(datas);
      setDatas(datas);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkLoginUser();
    getWarehousesAPI();
  }, []);

  const handleWarehouseChange = (value: string) => {
    localStorage.setItem("superAdminSelectedWarehouseId", value);
    setSelectedWarehouseId(value);
    setSelectedRow(null);
    callAPI(value);
  };

  const stockColumns: GridColDef[] = [
    { 
      field: 'product.code', 
      headerName: 'Code',
      flex: 1,
      renderCell: ({ row }: Partial<GridRowParams>) => row.product.code,
    },
    { 
      field: 'product.name', 
      headerName: 'Name', 
      flex: 1,
      renderCell: ({ row }: Partial<GridRowParams>) => row.product.name,
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      type: "actions",
      sortable: false,
      width:280,
      renderCell: ({ row }: Partial<GridRowParams>) =>
        <Stack spacing={1} direction="row">
          { row.quantity > 0 && (
          <Button variant="outlined" size="small" startIcon={<IconMinus />} onClick={() => handleReduceStockProductId(row.product.id)} color='error'>Reduce Stock</Button>
          )}
          <Button variant="outlined" size="small" startIcon={<IconPlus />} onClick={() => handleAddStockProductId(row.product.id)}>Add Stock</Button>
        </Stack>,
    },
  ];

  const journalColumns: GridColDef[] = [
    { 
      field: 'type', 
      headerName: 'Type',
      flex: 1,
    },
    { 
      field: 'createdAt', 
      headerName: 'createdAt', 
      flex: 1,
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      flex: 1,
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const handleRowSelection = ({ row }: Partial<GridRowParams>) => {
    setSelectedRow(row);
    console.log('Selected Row:', row);
  }

  const handleReduceStockProductId = (value : string) => {
    localStorage.setItem("selectedProductId", value);
    router.push("/inventories/reduce_product_stock");
  }

  const handleAddStockProductId = (value : string) => {
    localStorage.setItem("selectedProductId", value);
    router.push("/inventories/add_product_stock");
  }

  const handleAddStock = () => {
    localStorage.removeItem("selectedProductId");
    router.push("/inventories/add_product_stock");
  }

  return (
    <PageContainer title="Inventory Stocks - List Page" description="this is Inventory Stocks - List Page">
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
            <DashboardCard title="Stocks" subtitle="Inventory"  action={
              <Stack spacing={2} direction="row">
                <Button variant="text" size="medium" startIcon={<IconRefresh />} onClick={() => callAPI(selectedWarehouseId || "")}>Refresh</Button>
                <Button variant="contained" size="medium" startIcon={<IconPlus />} onClick={handleAddStock}>Add New</Button>
              </Stack>
              }>
              <DataGrid
                rows={datas.stocks}
                columns={stockColumns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                sx={{ border: 0 }}
                onRowClick={handleRowSelection}
              />
            </DashboardCard>
          </Grid>
          <Grid item xs={12} lg={12}>
            <DashboardCard title="Journals" subtitle={selectedRow ? ("Stock: " + selectedRow.product.code + " - " + selectedRow.product.name + " - " + selectedRow.quantity + "(pcs)") : "Stock"}>
              <DataGrid
                getRowId={() => crypto.randomUUID()}
                rows={selectedRow ? selectedRow.journals : []}
                columns={journalColumns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                sx={{ border: 0 }}
              />
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ListPage;
