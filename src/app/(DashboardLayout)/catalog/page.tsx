'use client';
import { Avatar, Box, Button, CardContent, Fab, Grid, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { IconBasket, IconDetails, IconEdit, IconEye, IconFileInfo, IconPhoto, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import BlankCard from '../components/shared/BlankCard';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const ListPage = () => {
  const [datas, setDatas] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

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
    const interval = setInterval(callAPI, 1000 * 5);
  }, []);

  const handleClickOpen = (product : any) => () => {
    setSelectedData(product);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedData(null);
    setOpen(false);
  };

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
                    <Tooltip title="Add To Cart" onClick={handleClickOpen(product)}>
                      <Fab
                        size="small"
                        color="primary"
                        sx={{ bottom: "75px", right: "15px", position: "absolute" }}
                      >
                        <IconPhoto size="16" />
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
                        <Typography>Rp. {product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Typography>
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
      <Dialog
        open={open}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">{selectedData ? selectedData.name : ""} - Product Images</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >

          <ImageList>
            {selectedData ? selectedData.images.map((image : any) => (
              <ImageListItem key={image.path}>
                <img
                  srcSet={`${image.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${image.path}?w=248&fit=crop&auto=format`}
                  alt={image.name}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={image.name}
                  subtitle={image.description}
                />
              </ImageListItem>
            )) : "" }
          </ImageList>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ListPage;
