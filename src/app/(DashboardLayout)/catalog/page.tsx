'use client';
import { Avatar, Box, Button, CardContent, Fab, Grid, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { IconPhoto } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import BlankCard from '../components/shared/BlankCard';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

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

const ListPage = () => {
  const [datas, setDatas] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<ProductEntity>({});

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

    return () => clearInterval(interval);
  }, []);

  const handleClickOpen = (product : any) => () => {
    setSelectedData(product);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedData({});
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
        <DialogTitle id="scroll-dialog-title">{selectedData?.name ?? ""} - Product Images</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >

          <ImageList>
            {selectedData?.images ? selectedData.images.map((image : any) => (
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
