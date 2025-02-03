'use client';
import { Avatar, Box, Button, CardContent, Fab, Grid, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { IconBasket, IconDetails, IconEdit, IconEye, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import BlankCard from '../components/shared/BlankCard';

const ListPage = () => {
  const [datas, setDatas] = useState([]);

  const callAPI = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products?withInactive=true&withTrashed=true`);
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
    <PageContainer title="Product Catalog - List Page" description="this is Product Catalog - List Page">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <DashboardCard title="Catalog" subtitle="Product"/>
          </Grid>

          <Grid item xs={12} lg={12}>
            <Grid container spacing={3}>
              {datas.map((product : any, index) => (
                <Grid item xs={12} md={4} lg={3} key={index}>
                  <BlankCard>
                    <Typography>
                      <Avatar
                        src={product.images[0].path || ""} variant="square"
                        sx={{
                          height: 250,
                          width: '100%',
                        }}
                        
                      />
                    </Typography>
                    <Tooltip title="Add To Cart">
                      <Fab
                        size="small"
                        color="primary"
                        sx={{ bottom: "75px", right: "15px", position: "absolute" }}
                      >
                        <IconBasket size="16" />
                      </Fab>
                    </Tooltip>
                    <CardContent sx={{ p: 3, pt: 2 }}>
                      <Typography variant="h6">{product.name}</Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mt={1}
                      >
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">${product.price}</Typography>
                        <Typography>{product.quantity} pcs</Typography>
                        </Grid>
                      </Stack>
                    </CardContent>
                  </BlankCard>
                </Grid>
              ))}
            </Grid>
          </Grid>

        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ListPage;
