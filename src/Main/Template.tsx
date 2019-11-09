import React from "react";
import styled from "styled-components/macro";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";

const StyledToolbar = styled(Toolbar)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default React.memo(function({
  children,
  rightElement,
}: {
  children: JSX.Element;
  rightElement?: JSX.Element;
}) {
  return (
    <>
      <Box flexDirection="column" width="100%" display="flex">
        <AppBar position="relative">
          <StyledToolbar>
            <Typography variant="h6" color="inherit" noWrap>
              FFMPEG Online
            </Typography>
            {rightElement}
          </StyledToolbar>
        </AppBar>
        {children}
      </Box>
    </>
  );
});