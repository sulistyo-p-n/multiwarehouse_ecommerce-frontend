import {
  IconAperture,
  IconArmchair,
  IconBooks,
  IconBuildingWarehouse,
  IconCategory,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconStack2,
  IconTransfer,
  IconTypography,
  IconUser,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
    role: "WAREHOUSE_ADMIN",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
    role: "WAREHOUSE_ADMIN",
  },
  {
    navlabel: true,
    subheader: "Administration",
    role: "SUPER_ADMIN",
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: IconUsers,
    href: "/users",
    role: "SUPER_ADMIN",
  },
  {
    navlabel: true,
    subheader: "Base",
    role: "SUPER_ADMIN",
  },
  {
    id: uniqueId(),
    title: "Warehouses",
    icon: IconBuildingWarehouse,
    href: "/warehouses",
    role: "SUPER_ADMIN",
  },
  {
    id: uniqueId(),
    title: "Product Categories",
    icon: IconCategory,
    href: "/product_categories",
    role: "SUPER_ADMIN",
  },
  {
    id: uniqueId(),
    title: "Products",
    icon: IconArmchair,
    href: "/products",
    role: "SUPER_ADMIN",
  },
  {
    navlabel: true,
    subheader: "Inventory Management",
    role: "WAREHOUSE_ADMIN",
  },
  {
    id: uniqueId(),
    title: "Inventories",
    icon: IconStack2,
    href: "/inventories",
    role: "WAREHOUSE_ADMIN",
  },
  {
    id: uniqueId(),
    title: "Stock Mutations",
    icon: IconTransfer,
    href: "/stock_mutations",
    role: "WAREHOUSE_ADMIN",
  },
  {
    navlabel: true,
    subheader: "Catalog",
  },
  {
    id: uniqueId(),
    title: "Product Catalog",
    icon: IconBooks,
    href: "/catalog",
  },
  // {
  //   navlabel: true,
  //   subheader: "Auth",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Login",
  //   icon: IconLogin,
  //   href: "/authentication/login",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Register",
  //   icon: IconUserPlus,
  //   href: "/authentication/register",
  // },
  // {
  //   navlabel: true,
  //   subheader: "Utilities",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Typography",
  //   icon: IconTypography,
  //   href: "/utilities/typography",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Shadow",
  //   icon: IconCopy,
  //   href: "/utilities/shadow",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Icons",
  //   icon: IconMoodHappy,
  //   href: "/icons",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Sample Page",
  //   icon: IconAperture,
  //   href: "/sample-page",
  // },
];

export default Menuitems;
