import React, { useRef } from "react";
import cx from "classnames";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
/*import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";*/

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.js";
import authService from "services/authService";
import { UserContext } from "contexts/UserContext";

var ps;

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const { ...rest } = props;

  const history = useHistory();
  const userRef = useRef(undefined);
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    async function checkLogin() {
      try {
        const { data } = await authService.me();
        userRef.current = data;
        setUser(data);
      } catch (e) {
        history.push("/auth/login");
      }
    }

    checkLogin();
  }, []);

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async function (address) {
        try {
          await authService.updateProfile({ publicAddress: address[0] });
        } catch (e) {
          console.log('Error on upadte wallet', e);
        }
        window.location.reload();
      });
      window.ethereum.on('networkChanged', function () {
        window.location.reload();
      });
    }
  }, []);


  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(false);
  const [image] = React.useState(
    require("assets/img/sidebar-2.jpg").default
  );
  const [color] = React.useState("blue");
  const [bgColor] = React.useState("black");
  // const [hasImage, setHasImage] = React.useState(true);
  const [logo] = React.useState(
    require("assets/img/logo.png").default
  );
  // styles
  const classes = useStyles();
  const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1,
    });
  // ref for main panel div
  const mainPanel = React.createRef();
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  });
  // functions for changeing the states from components
  /*const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleBgColorClick = (bgColor) => {
    switch (bgColor) {
      case "white":
        setLogo(require("assets/img/logo.svg").default);
        break;
      default:
        setLogo(require("assets/img/logo-white.svg").default);
        break;
    }
    setBgColor(bgColor);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };*/
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  const getActiveRoute = (routes) => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  return (
    <UserContext.Provider value={userRef}>
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes.filter((item) => item?.isMenu)}
          logoText={"NFT Admin"}
          user={user}
          logo={logo}
          image={image}
          handleDrawerToggle={handleDrawerToggle}
          open={mobileOpen}
          color={color}
          bgColor={bgColor}
          miniActive={miniActive}
          {...rest}
        />
        <div className={mainPanelClasses} ref={mainPanel}>
          <AdminNavbar
            sidebarMinimize={sidebarMinimize.bind(this)}
            miniActive={miniActive}
            brandText={getActiveRoute(routes)}
            handleDrawerToggle={handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>
                <Switch>
                  {getRoutes(routes)}
                  <Redirect from="/admin" to="/" />
                </Switch>
              </div>
            </div>
          ) : (
            <div className={classes.map}>
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/admin" to="/" />
              </Switch>
            </div>
          )}
          {getRoute() ? <Footer fluid /> : null}
          {/*<FixedPlugin
            handleImageClick={handleImageClick}
            handleColorClick={handleColorClick}
            handleBgColorClick={handleBgColorClick}
            color={color}
            bgColor={bgColor}
            bgImage={image}
            handleFixedClick={handleFixedClick}
            fixedClasses={fixedClasses}
            sidebarMinimize={sidebarMinimize.bind(this)}
            miniActive={miniActive}
          />*/}
        </div>
      </div>
    </UserContext.Provider>
  );
}
