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

// @mui material components
import Divider from "@mui/material/Divider";

// EVNHCMC Smart Grid components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function Separator() {
  return (
    <SoftBox position="relative" py={0.25}>
      <Divider />
      <SoftBox
        bgColor="white"
        position="absolute"
        top="50%"
        left="50%"
        px={1.5}
        lineHeight={1}
        sx={{ transform: "translate(-50%, -60%)" }}
      >
        <SoftTypography variant="button" fontWeight="medium" color="secondary">
          or
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

export default Separator;
