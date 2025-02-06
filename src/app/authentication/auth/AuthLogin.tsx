import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import Link from "next/link";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

interface loginCommand {
  email : string;
  password : string;
}

export default function AuthLogin({ title, subtitle, subtext }: loginType) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
    
  const [formData, setFormData] = useState<loginCommand>({
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-type': 'application/json'
        }
      });
      const retrieveData = await res.json();
      console.log(retrieveData);
      if (res.status == 200) {
        localStorage.setItem("loginUser", JSON.stringify(retrieveData));
        enqueueSnackbar("Welcome Back " + retrieveData.username + "!", { variant: "info" });
        if (retrieveData.role == "CUSTOMER") router.push("/catalog");
        else router.push("/");
      } else {
        const message = retrieveData.message || "Internal Server Error";
        console.log(message);
        enqueueSnackbar(message, { variant: "error" });
      }
    } catch (err) {
      const message = err?.message || "Internal Server Error";
      console.log(message);
      enqueueSnackbar(message, { variant: "error" });
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

    <Stack>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="email"
          mb="5px"
        >
          Email
        </Typography>
        <CustomTextField
          type="email"
          variant="outlined"
          fullWidth
          value={formData.email}
          onChange={(e: any) => handleInputChange("email", e.target.value)}
        />
      </Box>
      <Box mt="25px">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
        >
          Password
        </Typography>
        <CustomTextField
          type="password"
          variant="outlined"
          fullWidth
          value={formData.password}
          onChange={(e: any) => handleInputChange("password", e.target.value)}
        />
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
      </Stack>
    </Stack>
    <Box>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        onClick={handleOnSubmit}
        type="submit"
      >
        Sign In
      </Button>
    </Box>
    {subtitle}
  </>
  );
};
