import React, { useEffect, useState } from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const [role, setRole] = useState("");

  const checkLoginUser = () => {
    if (typeof window !== 'undefined') {
      const localUser = localStorage.getItem("loginUser");
      const user = localUser ? JSON.parse(localUser) : {}
      
      if (user.role) {
        setRole(user.role);
      }
    }
  }
  
  useEffect(() => {
    checkLoginUser();
  }, []);

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {Menuitems.map((item) => {
          if (item.role != null) {
            if ((item.role == "WAREHOUSE_ADMIN") && (role != "WAREHOUSE_ADMIN") && (role != "SUPER_ADMIN")) return <></>;
            if ((item.role == "SUPER_ADMIN") && (role != "SUPER_ADMIN")) return <></>;
          }
          // {/********SubHeader**********/}
          if (item.subheader) {
            return (
              <NavGroup
                item={item}
                key={item.subheader}
              />
            );

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
