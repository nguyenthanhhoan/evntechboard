/**
=========================================================
* EVNHCMC Smart Grid - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import * as React from "react";
// import Flag from "react-flag-icon-css";
import FlagIconFactory from "react-flag-icon-css";

// react-router components
import { useLocation, Link } from "react-router-dom";


// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// EVNHCMC Smart Grid components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";

// EVNHCMC Smart Grid examples
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

import { useAuth } from "../../../auth-context/auth.context";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// EVNHCMC Smart Grid context
import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Images
import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";

import AuthApi from "../../../api/auth";
import { useNavigate } from "react-router-dom";


// Configure FlagIcon with useCssModules: false
const Flag = FlagIconFactory(React, { useCssModules: false });

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();

  const { user } = useAuth();
  const { setUser } = useAuth();
  const { t, i18n } = useTranslation(); // Initialize translation
  const [language, setLanguage] = useState("en");

  const changeLanguage = (lang) => {
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(lang)
          .then(() => {
            setLanguage(lang);
            console.log("Language changed to:", lang);
          })
          .catch((err) => console.error("Failed to change language:", err));
    } else {
      console.error("i18n.changeLanguage is not a function");
    }
  };

  const languageFlags = {
    en: "🇬🇧",
    es: "🇪🇸",
    fr: "🇫🇷",
    vi: "🇻🇳", // Updated to Vietnamese flag
  };

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    changeLanguage(newLang);
  };

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const handleLogout = () => {
    AuthApi.Logout(user);
    setUser(null);
    localStorage.removeItem("user");
    return navigate("/authentication/sign-in");
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        image={<img src={team2} alt="person" />}
        title={["New message", "from Laur"]}
        date="13 minutes ago"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        image={<img src={logoSpotify} alt="person" />}
        title={["New album", "by Travis Scott"]}
        date="1 day"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        color="secondary"
        image={
          <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
            payment
          </Icon>
        }
        title={["", "Payment successfully completed"]}
        date="2 days"
        onClick={handleCloseMenu}
      />
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <SoftBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </SoftBox>
        {isMini ? null : (
          <SoftBox sx={(theme) => navbarRow(theme, { isMini })}>
            <SoftBox pr={1}>
              <SoftInput
                placeholder="Type here..."
                icon={{ component: "search", direction: "left" }}
              />
            </SoftBox>
            <SoftBox color={light ? "white" : "inherit"}>
              {user && user.token ? (
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="logout"
                aria-haspopup="true"
                variant="contained"
                onClick={handleLogout}
              >
                <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color={light ? "white" : "dark"}
                  >
                    Logout
                  </SoftTypography>
              </IconButton>
              ) : (
              <Link to="/authentication/sign-in">
                <IconButton sx={navbarIconButton} size="small">
                  <Icon
                    sx={({ palette: { dark, white } }) => ({
                      color: light ? white.main : dark.main,
                    })}
                  >
                    account_circle
                  </Icon>
                  <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color={light ? "white" : "dark"}
                  >
                    Sign in
                  </SoftTypography>
                </IconButton>
              </Link>)}
              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon className={light ? "text-white" : "text-dark"}>notifications</Icon>
              </IconButton>
              {renderMenu()}
            </SoftBox>
            <SoftBox>
              <Select
                  value={language}
                  onChange={handleLanguageChange}
                  sx={{
                    color: light ? "white" : "dark",
                    height: "32px",
                    borderRadius: "50px",
                    background: "linear-gradient(45deg, #f5f7fa, #c3cfe2)",
                    "& .MuiSelect-icon": {
                      color: light ? "white" : "dark",
                    },
                    paddingLeft: "8px",
                    minWidth: "140px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  renderValue={(value) => (
                      <SoftBox display="flex" alignItems="center">
                        <Flag
                            code={
                              value === "en"
                                  ? "gb"
                                  : value === "es"
                                      ? "es"
                                      : value === "fr"
                                          ? "fr"
                                          : "vn"
                            }
                            size="1em"
                            style={{ marginRight: "8px", display: "inline-block" }}
                        />
                        <SoftTypography
                            variant="button"
                            fontWeight="medium"
                            sx={{ marginLeft: "8px" }}
                        >
                          {value === "en"
                              ? "English"
                              : value === "es"
                                  ? "Español"
                                  : value === "fr"
                                      ? "Français"
                                      : "Tiếng Việt"}
                        </SoftTypography>
                      </SoftBox>
                  )}
              >
                <MenuItem value="en">
                  <SoftBox display="flex" alignItems="center">
                    <Flag
                        code="gb"
                        size="1em"
                        style={{ marginRight: "8px", display: "inline-block" }}
                    />
                    <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        sx={{ marginLeft: "8px" }}
                    >
                      English
                    </SoftTypography>
                  </SoftBox>
                </MenuItem>
                <MenuItem value="es">
                  <SoftBox display="flex" alignItems="center">
                    <Flag
                        code="es"
                        size="1em"
                        style={{ marginRight: "8px", display: "inline-block" }}
                    />
                    <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        sx={{ marginLeft: "8px" }}
                    >
                      Español
                    </SoftTypography>
                  </SoftBox>
                </MenuItem>
                <MenuItem value="fr">
                  <SoftBox display="flex" alignItems="center">
                    <Flag
                        code="fr"
                        size="1em"
                        style={{ marginRight: "8px", display: "inline-block" }}
                    />
                    <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        sx={{ marginLeft: "8px" }}
                    >
                      Français
                    </SoftTypography>
                  </SoftBox>
                </MenuItem>
                <MenuItem value="vi">
                  <SoftBox display="flex" alignItems="center">
                    <Flag
                        code="vn"
                        size="1em"
                        style={{ marginRight: "8px", display: "inline-block" }}
                    />
                    <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        sx={{ marginLeft: "8px" }}
                    >
                      Tiếng Việt
                    </SoftTypography>
                  </SoftBox>
                </MenuItem>
              </Select>
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
