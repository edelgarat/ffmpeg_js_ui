import React from "react";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

interface CommandChildComponentWrapperInterface {
  label: string;
  node: any;
  children: () => React.ReactNode;
  enable: () => void;
  disable: () => void;
}

export default React.memo(function({
  children,
  label,
  node,
  enable,
  disable,
}: CommandChildComponentWrapperInterface) {
  const checked = !!node;
  return (
    <Box display="flex" marginRight="18px">
      <FormControlLabel
        control={
          <Checkbox checked={checked} onChange={checked ? disable : enable} />
        }
        label={label}
      />
      {checked && children()}
    </Box>
  );
});
