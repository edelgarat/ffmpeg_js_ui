import React from "react";
import styled from "styled-components/macro";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText, {
  ListItemTextProps,
} from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import DownloadIcon from "@material-ui/icons/GetApp";

import { LocalFileInterface } from "../types";

interface FileMenuItemInterface {
  files: LocalFileInterface[];
  selectedFileNames: { [name: string]: true };
  toggleFileSelected: (file: LocalFileInterface) => void;
  downloadFile: (file: LocalFileInterface) => void;
  removeFile: (file: LocalFileInterface) => void;
}

const StyledList = styled(List)`
  li {
    .MuiListItem-secondaryAction {
      padding-right: 16px;
      transition: padding-right 0.2s;
    }
    .file_menu_item_actions {
      transition: opacity 0.2s;
      opacity: 0;
    }
    :hover {
      .MuiListItem-secondaryAction {
        padding-right: 80px;
      }
      .file_menu_item_actions {
        opacity: 1;
      }
    }
  }
`;

const primaryTypographyProps: ListItemTextProps["primaryTypographyProps"] = {
  noWrap: true,
  display: "block",
};

export default React.memo(function({
  files,
  selectedFileNames,
  toggleFileSelected,
  downloadFile,
  removeFile,
}: FileMenuItemInterface) {
  return (
    <StyledList disablePadding>
      {files.map(file => (
        <ListItem
          key={file.name}
          button
          selected={selectedFileNames[file.name]}
          onClick={() => toggleFileSelected(file)}
        >
          <ListItemText
            primary={file.name}
            primaryTypographyProps={primaryTypographyProps}
          />
          <ListItemSecondaryAction className="file_menu_item_actions">
            <IconButton size="small" onClick={() => downloadFile(file)}>
              <DownloadIcon />
            </IconButton>
            <IconButton size="small" onClick={() => removeFile(file)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </StyledList>
  );
});
