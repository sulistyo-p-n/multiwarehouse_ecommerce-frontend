import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link  from 'next/link';

import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { useRouter } from "next/navigation";

interface registerType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
  }

interface registerCommand {
    username : string;
    email : string;
    password : string;
}

export default function AuthRegister({ title, subtitle, subtext }: registerType) {
    const router = useRouter();
 
    const [formData, setFormData] = useState<registerCommand>({
        username: "",
        email: "",
        password: "",
    });

    const handleInputChange = (field : string, value : string | boolean) => {
      setFormData({ ...formData, [field]: value });
    };
    
    const handleOnSubmit = () => {
      postAPI();
    };
    
    const postAPI = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json'
            }
            });
            const retrieveData = await res.json();
            console.log(retrieveData);
            if (res.status == 200) {
            router.push("/authentication/login");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const checkLoginUser = () => {
      const localUser = localStorage.getItem("loginUser");
      if (!localUser) return;
      
      const user = JSON.parse(localUser);
      if (!user) return;
      if (!user.role) return;
      if (user.role == "CUSTOMER") router.push("/catalog");
      else router.push("/");
    }
    
    useEffect(() => {
    checkLoginUser();
    }, []);

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='username' mb="5px">Username</Typography>
                    <CustomTextField
                        id="username"
                        variant="outlined"
                        fullWidth
                        value={formData.username}
                        onChange={(e: any) => handleInputChange("username", e.target.value)}
                    />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">Email</Typography>
                    <CustomTextField
                        type="email"
                        id="email"
                        variant="outlined"
                        fullWidth
                        value={formData.email}
                        onChange={(e: any) => handleInputChange("email", e.target.value)}
                    />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">Password</Typography>
                    <CustomTextField
                        type="password"
                        id="password"
                        variant="outlined"
                        fullWidth
                        value={formData.password}
                        onChange={(e: any) => handleInputChange("password", e.target.value)}
                    />
                </Stack>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleOnSubmit}
                    type="submit"
                >
                    Sign Up
                </Button>
            </Box>
            {subtitle}
        </>
    );
};
