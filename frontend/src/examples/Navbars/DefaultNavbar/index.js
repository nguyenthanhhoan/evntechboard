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

// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import * as React from "react";
// import Flag from "react-flag-icon-css";
import FlagIconFactory from "react-flag-icon-css";

// @mui material components
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";

// EVNHCMC Smart Grid components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// EVNHCMC Smart Grid examples
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";
import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";

// EVNHCMC Smart Grid base styles
import breakpoints from "assets/theme/base/breakpoints";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";


// Configure FlagIcon with useCssModules: false
const Flag = FlagIconFactory(React, { useCssModules: false });


function DefaultNavbar({ transparent, light, action }) {
  const { t, i18n } = useTranslation(); // Initialize translation
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [language, setLanguage] = useState(i18n.language || "en"); // Track current language

  // Debug i18n
  console.log("i18n object:", i18n);
  console.log("i18n.changeLanguage exists:", typeof i18n.changeLanguage === "function");
  console.log("Flag component available:", !!Flag);

  const openMobileNavbar = ({ currentTarget }) => setMobileNavbar(currentTarget.parentNode);
  const closeMobileNavbar = () => setMobileNavbar(false);

  useEffect(() => {
    // A function that sets the display state for the DefaultNavbarMobile.
    function displayMobileNavbar() {
      if (window.innerWidth < breakpoints.values.lg) {
        setMobileView(true);
        setMobileNavbar(false);
      } else {
        setMobileView(false);
        setMobileNavbar(false);
      }
    }

    /** 
     The event listener that's calling the displayMobileNavbar function when 
     resizing the window.
    */
    window.addEventListener("resize", displayMobileNavbar);

    // Call the displayMobileNavbar function to set the state with the initial value.
    displayMobileNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", displayMobileNavbar);
  }, []);

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

  return (
    <Container>
      <SoftBox
        py={1.5}
        px={{ xs: transparent ? 4 : 5, sm: transparent ? 2 : 5, lg: transparent ? 0 : 5 }}
        my={2}
        mx={3}
        width="calc(100% - 48px)"
        borderRadius="section"
        shadow={transparent ? "none" : "md"}
        color={light ? "white" : "dark"}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="absolute"
        left={0}
        zIndex={3}
        sx={({ palette: { transparent: transparentColor, white }, functions: { rgba } }) => ({
          backgroundColor: transparent ? transparentColor.main : rgba(white.main, 0.8),
          backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
        })}
      >
        <SoftBox component={Link} to="/" py={transparent ? 1.5 : 0.75} lineHeight={1}>
          <SoftTypography variant="button" fontWeight="bold" color={light ? "white" : "dark"}>
            EVNHCMC Smart Grid
          </SoftTypography>
        </SoftBox>
        <SoftBox color="inherit" display={{ xs: "none", lg: "flex" }} m={0} p={0}>
          <DefaultNavbarLink icon="donut_large" name="dashboard" route="/dashboard" light={light} />
          <DefaultNavbarLink icon="person" name="profile" route="/profile" light={light} />
          <DefaultNavbarLink
            icon="account_circle"
            name="sign up"
            route="/authentication/sign-up"
            light={light}
          />
          <DefaultNavbarLink
            icon="key"
            name="sign in"
            route="/authentication/sign-in"
            light={light}
          />
        </SoftBox>
        <SoftBox display={{ xs: "none", lg: "flex" }} alignItems="center">
          {action &&
              (action.type === "internal" ? (
                  <SoftBox mr={1}>
                    <SoftButton
                        component={Link}
                        to={action.route}
                        variant="gradient"
                        color={action.color ? action.color : "info"}
                        size="small"
                        circular
                    >
                      {action.label}
                    </SoftButton>
                  </SoftBox>
              ) : (
                  <SoftBox mr={1}>
                    <SoftButton
                        component="a"
                        href={action.route}
                        target="_blank"
                        rel="noreferrer"
                        variant="gradient"
                        color={action.color ? action.color : "info"}
                        size="small"
                        circular
                    >
                      {action.label}
                    </SoftButton>
                  </SoftBox>
              ))}
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
                          code={value === "en" ? "gb" : value === "es" ? "es" : value === "fr" ? "fr" : "vn"}
                          size="1em"
                          style={{ marginRight: "8px", display: "inline-block" }}
                      />
                      <SoftTypography variant="button" fontWeight="medium" sx={{ marginLeft: "8px" }}>
                        {value === "en" ? "English" : value === "es" ? "Español" : value === "fr" ? "Français" : "Tiếng Việt"}
                      </SoftTypography>
                    </SoftBox>
                )}
            >
              <MenuItem value="en">
                <SoftBox display="flex" alignItems="center">
                  <Flag code="gb" size="1em" style={{ marginRight: "8px", display: "inline-block" }} />
                  <SoftTypography variant="button" fontWeight="medium" sx={{ marginLeft: "8px" }}>
                    English
                  </SoftTypography>
                </SoftBox>
              </MenuItem>
              <MenuItem value="es">
                <SoftBox display="flex" alignItems="center">
                  <Flag code="es" size="1em" style={{ marginRight: "8px", display: "inline-block" }} />
                  <SoftTypography variant="button" fontWeight="medium" sx={{ marginLeft: "8px" }}>
                    Español
                  </SoftTypography>
                </SoftBox>
              </MenuItem>
              <MenuItem value="fr">
                <SoftBox display="flex" alignItems="center">
                  <Flag code="fr" size="1em" style={{ marginRight: "8px", display: "inline-block" }} />
                  <SoftTypography variant="button" fontWeight="medium" sx={{ marginLeft: "8px" }}>
                    Français
                  </SoftTypography>
                </SoftBox>
              </MenuItem>
              <MenuItem value="vi">
                <SoftBox display="flex" alignItems="center">
                  <Flag code="vn" size="1em" style={{ marginRight: "8px", display: "inline-block" }} />
                  <SoftTypography variant="button" fontWeight="medium" sx={{ marginLeft: "8px" }}>
                    Tiếng Việt
                  </SoftTypography>
                </SoftBox>
              </MenuItem>
            </Select>
          </SoftBox>
        </SoftBox>
        {/*{action &&*/}
        {/*  (action.type === "internal" ? (*/}
        {/*    <SoftBox display={{ xs: "none", lg: "inline-block" }}>*/}
        {/*      <SoftButton*/}
        {/*        component={Link}*/}
        {/*        to={action.route}*/}
        {/*        variant="gradient"*/}
        {/*        color={action.color ? action.color : "info"}*/}
        {/*        size="small"*/}
        {/*        circular*/}
        {/*      >*/}
        {/*        {action.label}*/}
        {/*      </SoftButton>*/}
        {/*    </SoftBox>*/}
        {/*  ) : (*/}
        {/*    <SoftBox display={{ xs: "none", lg: "inline-block" }}>*/}
        {/*      <SoftButton*/}
        {/*        component="a"*/}
        {/*        href={action.route}*/}
        {/*        target="_blank"*/}
        {/*        rel="noreferrer"*/}
        {/*        variant="gradient"*/}
        {/*        color={action.color ? action.color : "info"}*/}
        {/*        size="small"*/}
        {/*        circular*/}
        {/*      >*/}
        {/*        {action.label}*/}
        {/*      </SoftButton>*/}
        {/*    </SoftBox>*/}
        {/*  ))}*/}
        <SoftBox
          display={{ xs: "inline-block", lg: "none" }}
          lineHeight={0}
          py={1.5}
          pl={1.5}
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={openMobileNavbar}
        >
          <Icon fontSize="default">{mobileNavbar ? "close" : "menu"}</Icon>
        </SoftBox>
      </SoftBox>
      {mobileView && <DefaultNavbarMobile open={mobileNavbar} close={closeMobileNavbar} />}
    </Container>
  );
}

// Setting default values for the props of DefaultNavbar
DefaultNavbar.defaultProps = {
  transparent: false,
  light: false,
  action: false,
};

// Typechecking props for the DefaultNavbar
DefaultNavbar.propTypes = {
  transparent: PropTypes.bool,
  light: PropTypes.bool,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(["external", "internal"]).isRequired,
      route: PropTypes.string.isRequired,
      color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "light",
      ]),
      label: PropTypes.string.isRequired,
    }),
  ]),
};

export default DefaultNavbar;
