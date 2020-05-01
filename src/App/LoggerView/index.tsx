import React, { RefObject } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import styled from "styled-components/macro";

const StyledCode = styled.code`
  white-space: pre-wrap;
  overflow: scroll;
  background-color: white;
  padding: 12px;
  flex: 1;
`;

interface LoggerViewInterface {
  logRef: RefObject<HTMLElement>;
}

export default React.memo(function({ logRef }: LoggerViewInterface) {
  return (
    <Box flexDirection="column" display="flex" overflow="hidden" flex={1}>
      <Box
        padding="18px"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button onClick={() => (logRef.current.innerHTML = "")}>
          Clear logs
        </Button>
      </Box>
      <StyledCode ref={logRef} />
    </Box>
  );
});
