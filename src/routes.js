// @material-ui/icons
import Group from "@material-ui/icons/Group";
import CategoryIcon from "@material-ui/icons/Category";
import LoginPage from "views/Auth/LoginPage.js";
import RegisterPage from "views/Auth/RegisterPage";
import UserIndex from "views/User/UserIndex";
import UserView from "views/User/UserView";
import UserCreate from "views/User/UserCreate";
import UserProfile from "./views/Auth/UserProfile";
import ForgotPage from "./views/Auth/ForgotPage";
import NftCreate from "./views/Nft/NftCreate";
import NftIndex from "./views/Nft/NftIndex";
// import TraitCreate from "./views/Trait/TraitCreate";
// import TraitIndex from "./views/Trait/TraitIndex";
// import TraitView from "./views/Trait/TraitView";
import NftMarketIndex from "views/NftMarket/NftMarketIndex";
import CollectionIndex from "views/Collection/CollectionIndex";
// import GenerateNftCreate from "./views/generateNft/GenerateNftCreate";

// import NftAuctionView from "views/NftAuction/NftAuctionView";
// import GenerateNftCreate from "./views/generateNft/GenerateNftCreate";
// import GenerateNftIndex from "./views/generateNft/GenerateNftIndex";
// import GenerateNftView from "./views/generateNft/GenerateNftView";

var dashRoutes = [
  {
    hide: true,
    collapse: true,
    name: "Auth",
    views: [
      {
        path: "/login",
        name: "Login",
        component: LoginPage,
        layout: "/auth",
      },
      {
        path: "/register",
        name: "Register",
        component: RegisterPage,
        layout: "/auth",
      },
      {
        path: "/forgot",
        name: "Forgot",
        component: ForgotPage,
        layout: "/auth",
      },
    ],
  },
  // =================================================================== DASHBOARD
  {
    isMenu: true,
    path: "/dashboard",
    name: "NFT",
    component: NftIndex,
    layout: "/admin",
    icon: CategoryIcon,
  },
  // =================================================================== CATEGORY
  /*{
    path: "/category/create",
    name: "Create Category",
    component: CategoryCreate,
    layout: "/admin",
  },
  {
    path: "/category/edit/:id",
    name: "Create Category",
    component: CategoryCreate,
    layout: "/admin",
  },
  {
    isMenu: true,
    path: "/category",
    name: "Category",
    component: CategoryIndex,
    layout: "/admin",
    icon: CategoryIcon,
  },*/
  // =================================================================== NFT
  {
    path: "/nft/create",
    name: "Create NFT",
    component: NftCreate,
    layout: "/admin",
  },
  {
    path: "/nft/edit/:id",
    name: "Create Category",
    component: NftCreate,
    layout: "/admin",
  },
  /*{
    isMenu: true,
    path: "/nft",
    name: "NFT",
    component: NftIndex,
    layout: "/admin",
    icon: ImageIcon,
  },*/
  // =================================================================== COLLECTIONS
  {
    isMenu: true,
    path: "/collection",
    name: "Collection",
    component: CollectionIndex,
    layout: "/admin",
    icon: CategoryIcon,
  },
  // =================================================================== MARKET PLACE
  {
    isMenu: true,
    path: "/market-place",
    name: "Market place",
    component: NftMarketIndex,
    layout: "/admin",
    icon: CategoryIcon,
  },
  // =================================================================== GAS HISTORY
  /*{
    isMenu: true,
    path: "/gas_history",
    name: "Gas History",
    component: GasHistory,
    layout: "/admin",
    icon: CategoryIcon,
  },*/
  // =================================================================== TRANSACTION
  /*{
    isMenu: true,
    path: "/minting_history",
    name: "Minting History",
    component: MintingHistory,
    layout: "/admin",
    icon: CategoryIcon,
  },*/
  // =================================================================== TRAIT
  // {
  //   path: "/trait/create",
  //   name: "Create Trait",
  //   component: TraitCreate,
  //   layout: "/admin",
  // },
  // {
  //   path: "/trait/edit/:id",
  //   name: "Edit Trait",
  //   component: TraitCreate,
  //   layout: "/admin",
  // },
  // {
  //   path: "/trait/:id",
  //   name: "Trait Management",
  //   component: TraitView,
  //   layout: "/admin",
  // },
  // {
  //   isMenu: true,
  //   path: "/trait",
  //   name: "Trait Management",
  //   component: TraitIndex,
  //   layout: "/admin",
  //   icon: Group,
  // },
  // =================================================================== NFT MANAGER
  // {
  //   path: "/generatenft/create",
  //   name: "Create Trait",
  //   component: GenerateNftCreate,
  //   layout: "/admin",
  // },
  // {
  //   path: "/generatenft/edit/:id",
  //   name: "Edit Trait",
  //   component: GenerateNftCreate,
  //   layout: "/admin",
  // },
  // {
  //   path: "/generatenft/:id",
  //   name: "Trait Management",
  //   component: TraitView,
  //   layout: "/admin",
  // },
  // {
  //   isMenu: true,
  //   path: "/generatenft",
  //   name: "Genarate NFT",
  //   component: GenerateNftCreate,
  //   layout: "/admin",
  //   icon: Group,
  // },
  // =================================================================== USER
  {
    path: "/profile",
    name: "Profile",
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/user/create",
    name: "Create User",
    component: UserCreate,
    layout: "/admin",
  },
  {
    path: "/user/edit/:id",
    name: "Edit user",
    component: UserCreate,
    layout: "/admin",
  },
  {
    path: "/user/:id",
    name: "User",
    component: UserView,
    layout: "/admin",
  },
  {
    isMenu: true,
    path: "/user",
    name: "User",
    component: UserIndex,
    layout: "/admin",
    icon: Group,
  },
];
export default dashRoutes;
