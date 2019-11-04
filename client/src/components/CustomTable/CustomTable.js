import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "./TablePaginationActions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(2),
    border: "0.5px solid grey",
    height: 450
  },
  table: {
    minWidth: 650,
    minHeight: 500
  },
  tableBodyCell: {
    wordWrap: "break-word",
    whiteSpace: "normal"
  },
  tableHeaderCell: {
    wordWrap: "break-word",
    whiteSpace: "normal",
    backgroundColor: "grey",
    color: "white",
    position: "sticky",
    top: 0
  }
}));
const EmptyRowsView = props => {
  const message = "No data to show";
  return (
    <TableRow>
      <TableCell
        align="left"
        component="td"
        scope="row"
        colSpan={props.colspan}
      >
        <Typography variant={"subtitle2"} align={"center"}>
          {message}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default function CustomTable(props) {
  const [state, setState] = useState({
    data: [],
    offset: 0,
    perPage: 10,
    page: 0
  });
  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    const newState = {
      offset: newPage * state.perPage,
      page: newPage
    };

    setState({ ...state, ...newState });
  };

  const handleChangeRowsPerPage = event => {
    setState({ ...state, perPage: event.target.value, offset: 0, page: 0 });
  };

  return (
    <>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            {props.columns.map(col => {
              return (
                <TableCell
                  align="left"
                  component="th"
                  className={classes.tableHeaderCell}
                  key={col.key}
                >
                  {col.name}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.length ? (
            props.data
              .slice(
                state.page * state.perPage,
                state.page * state.perPage + state.perPage
              )
              .map(row => (
                <TableRow key={row.name}>
                  {props.columns.map(col => {
                    return (
                      <TableCell
                        align="left"
                        component="td"
                        scope="row"
                        className={classes.tableBodyCell}
                        key={col.key}
                      >
                        {typeof col.renderer === "function"
                          ? col.renderer(row[col.key])
                          : row[col.key]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
          ) : (
            <EmptyRowsView colspan={props.columns.length} />
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={props.data.length}
        rowsPerPage={state.perPage}
        page={state.page}
        backIconButtonProps={{
          "aria-label": "Previous Page"
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page"
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </>
  );
}
