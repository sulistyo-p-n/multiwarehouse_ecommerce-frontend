'use client';
import { Box, Button, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { IconCheck, IconDetails, IconEdit, IconEye, IconMinus, IconPlus, IconRefresh, IconTrash, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from "notistack";

const ListPage = () => {
  const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

  const [datas, setDatas] = useState<any>({});
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
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

      if (user.role != "SUPER_ADMIN") return;

      setActiveSingleWarehouse(false);
      const superAdminSelectedWarehouseId = localStorage.getItem("superAdminSelectedWarehouseId");
      if (superAdminSelectedWarehouseId) {
        setSelectedWarehouseId(superAdminSelectedWarehouseId);
        callAPI(superAdminSelectedWarehouseId);
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stock_mutations/by_warehouse/${warehouseId}`, {
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
    callAPI(value);
  };

  const columns: GridColDef[] = [
    { 
      field: 'sourceWarehouse.name', 
      headerName: 'Source Warehouse Name',
      flex: 1,
      renderCell: ({ row }: Partial<GridRowParams>) => row.sourceWarehouse.name,
    },
    { 
      field: 'targetWarehouse.name', 
      headerName: 'Target Warehouse Name', 
      flex: 1,
      renderCell: ({ row }: Partial<GridRowParams>) => row.targetWarehouse.name,
    },
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
      field: 'status', 
      headerName: 'Status', 
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      type: "actions",
      sortable: false,
      width:220,
      renderCell: ({ row }: Partial<GridRowParams>) =>
        <Stack spacing={1} direction="row">
          { ((row.sourceWarehouse.id == selectedWarehouseId) && (row.status == "PENDING")) && (
          <>
          <Button variant="outlined" size="small" startIcon={<IconX />} onClick={() => handleStockMutationReject(row.id)} color='error'>Reject</Button>
          <Button variant="outlined" size="small" startIcon={<IconCheck />} onClick={() => handleStockMutationApprove(row.id)}>Approve</Button>
          </>
          )}
        </Stack>,
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const handleStockMutationReject = (value : string) => {
    rejectAPI(value);
  }

  const handleStockMutationApprove = (value : string) => {
    approveAPI(value);
  }

  const handleStockMutationRequest = () => {
    router.push("/stock_mutations/request");
  }

  const rejectAPI = async (id : string) => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stock_mutations/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const currentData = await res.json();
      console.log(currentData);
      if (res.status == 200) {
        enqueueSnackbar("Stock Mutation Rejected", { variant: "success" });
        callAPI(selectedWarehouseId || "");
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

  const approveAPI = async (id : string) => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stock_mutations/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-type': 'application/json'
        }
      });
      const currentData = await res.json();
      console.log(currentData);
      if (res.status == 200) {
        enqueueSnackbar("Stock Mutation Approved", { variant: "success" });
        callAPI(selectedWarehouseId || "");
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

  return (
    <PageContainer title="Stock Mutations - List Page" description="this is Inventory Stock Mutations - List Page">
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
            <DashboardCard title="Stock Mutations" subtitle="Inventory"  action={
              <Stack spacing={2} direction="row">
                <Button variant="text" size="medium" startIcon={<IconRefresh />} onClick={() => callAPI(selectedWarehouseId || "")}>Refresh</Button>
                <Button variant="contained" size="medium" startIcon={<IconPlus />} onClick={handleStockMutationRequest}>Create New Request</Button>
              </Stack>
              }>
              <DataGrid
                rows={datas}
                columns={columns}
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
