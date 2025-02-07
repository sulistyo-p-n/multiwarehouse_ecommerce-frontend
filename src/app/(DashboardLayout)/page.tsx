'use client';
import { Box, Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { IconRefresh } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WarehouseOverview from './components/dashboard/WarehouseOverview';

const ListPage = () => {
  const router = useRouter();

  const [datas, setDatas] = useState<any>({});
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [activeSingleWarehouse, setActiveSingleWarehouse] = useState<boolean>(true);
  const [warehouses, setWarehouses] = useState([]);

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
    const interval = setInterval(function() {callAPI(selectedWarehouseId) }, 1000 * 5);
    return () => clearInterval(interval);
  }, [selectedWarehouseId]);

  const handleWarehouseChange = (value: string) => {
    localStorage.setItem("superAdminSelectedWarehouseId", value);
    setSelectedWarehouseId(value);
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
      field: 'addition', 
      headerName: 'Addition', 
      flex: 1,
      renderCell: ({ row }: Partial<GridRowParams>) => row.journals.filter(journal => journal.type == "ADDICTION").map(journal => journal.quantity).reduce((sum, num) => sum + num, 0)
    },
    { 
      field: 'reduction', 
      headerName: 'Reduction', 
      flex: 1,
      renderCell: ({ row }: Partial<GridRowParams>) => row.journals.filter(journal => journal.type == "REDUCTION").map(journal => journal.quantity).reduce((sum, num) => sum - num, 0)
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <PageContainer title="Inventory Stocks - List Page" description="this is Inventory Stocks - List Page">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <DashboardCard title="Dashboard" subtitle="Warehouse"
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
            <WarehouseOverview stocks={datas.stocks} />
          </Grid>
          <Grid item xs={12} lg={12}>
            <DashboardCard title="Stocks" subtitle="Inventory"  action={
              <Stack spacing={2} direction="row">
                <Button variant="text" size="medium" startIcon={<IconRefresh />} onClick={() => callAPI(selectedWarehouseId)}>Refresh</Button>
              </Stack>
              }>
              <DataGrid
                rows={datas.stocks}
                columns={stockColumns}
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
