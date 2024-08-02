import { Link as RouterLink } from "react-router-dom";
import { Box } from "@mui/material";
import logoImgDark from "../image.png";

function Logo({ disableLink = false, sx, mode }) {
  const logo = (
    <Box sx={{ width: 75, height: 75, ...sx }}>
      <img src={logoImgDark} alt="logo" width="100%" />
    </Box>
  );
  if (disableLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}

export default Logo;
