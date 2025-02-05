'use client';
import { Button, MenuItem, Select, Stack, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { IconDetails, IconEdit, IconEye, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const columns: GridColDef[] = [
  { 
    field: 'username', 
    headerName: 'Username',
    flex: 1 
  },
  { 
    field: 'email', 
    headerName: 'Email', 
    flex: 1 
  },
  { 
    field: 'role', 
    headerName: 'Role', 
    flex: 1,
    valueGetter: (value) => {
      if (value == "CUSTOMER") return "Customer";
      if (value == "SUPER_ADMIN") return "Super Admin";
      if (value == "WAREHOUSE_ADMIN") return "Warehouse Admin";
      return "-";
    }
  },
  { 
    field: 'active', 
    headerName: 'Active', 
    type: "boolean",
    flex: 1 
  },
  {
    field: "action",
    headerName: "Action",
    type: "actions",
    sortable: false,
    width:180,
    renderCell: ({ row }: Partial<GridRowParams>) =>
      <Stack spacing={1} direction="row">
        { (row.isSoftDeleted!) ?
          <>
            <Button variant="outlined" size="small" startIcon={<IconTrash />} color="error" href={`/users/${row.id}`}>Deleted Detail</Button>
          </>
          :
          <>
            <Button variant="outlined" size="small" startIcon={<IconEye />} href={`/users/${row.id}`}>Detail</Button>
            <Button variant="outlined" size="small" startIcon={<IconEdit />} href={`/users/${row.id}/edit`}>Edit</Button>
          </>
        }
      </Stack>,
  },
];

const paginationModel = { page: 0, pageSize: 10 };

const ListPage = () => {
  const [datas, setDatas] = useState([]);

  const callAPI = async () => {
    try {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      const user = JSON.parse(localUser);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users?withInactive=true&withTrashed=true`, {
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
    callAPI();
  }, []);

  return (
    <PageContainer title="Users - List Page" description="this is Users - List Page">
      <DashboardCard title="Users" subtitle="List"  action={
        <Stack spacing={2} direction="row">
          <Button variant="text" size="medium" startIcon={<IconRefresh />} onClick={callAPI}>Refresh</Button>
          <Button variant="contained" size="medium" startIcon={<IconPlus />} href="/users/create">Add New</Button>
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
    </PageContainer>
  );
};

export default ListPage;
