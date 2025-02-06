'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard = () => {
  const router = useRouter();

  const checkLoginUser = () => {
    const localUser = localStorage.getItem("loginUser");
    if (!localUser) {
      router.push("/authentication/login");
      return;
    }
    const user = JSON.parse(localUser);
    if (user == null) {
      router.push("/authentication/login");
      return;
    }
    if (user.role == null) {
      router.push("/authentication/login");
      return;
    }
    if (user.role == "CUSTOMER") {
      router.push("/catalog");
      return;
    }
  }
  
  useEffect(() => {
  checkLoginUser();
  }, []);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearlyBreakup />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearlyBreakup />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearlyBreakup />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearlyBreakup />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearlyBreakup />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearlyBreakup />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearlyBreakup />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearlyBreakup />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearlyBreakup />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
