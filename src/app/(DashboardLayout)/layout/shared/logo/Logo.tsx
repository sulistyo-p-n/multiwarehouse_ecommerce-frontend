import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "164px",
  width: "430px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image src="/images/logos/ikiae-logo.svg" alt="logo" height={164} width={430} priority />
    </LinkStyled>
  );
};

export default Logo;
  