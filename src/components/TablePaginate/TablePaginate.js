import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useTable } from "react-table";
import Pagination from "@mui/material/Pagination";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  pagination: {
    paddingTop: "30px",
    display: "flex",
    justifyContent: "flex-end",
  },
});

export default function TablePaginate({
  columns,
  data,
  count,
  page,
  setPage,
  size,
}) {
  const classes = useStyles();
  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable({
    columns,
    data,
  });

  return (
    <div className="ReactTable -striped -highlight">
      <table {...getTableProps()} className="rt-table">
        <thead className="rt-thead -header">
          {headerGroups.map((headerGroup, groupKey) => (
            <tr
              key={groupKey}
              {...headerGroup.getHeaderGroupProps()}
              className="rt-tr"
            >
              {headerGroup.headers.map((column, key) => (
                <th
                  key={key}
                  {...column.getHeaderProps()}
                  className={classnames("rt-th rt-resizable-header", {
                    "-cursor-pointer": headerGroup.headers.length - 1 !== key,
                    "-sort-asc": column.isSorted && !column.isSortedDesc,
                    "-sort-desc": column.isSorted && column.isSortedDesc,
                  })}
                >
                  <div className="rt-resizable-header-content" style={{fontWeight: "bold"}}>
                    {column.render("Header")}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="rt-tbody">
          {rows.map((row, rowKey) => {
            prepareRow(row);
            return (
              <tr
                key={rowKey}
                {...row.getRowProps()}
                className={classnames(
                  "rt-tr",
                  { " -odd": rowKey % 2 === 0 },
                  { " -even": rowKey % 2 === 1 }
                )}
              >
                {row.cells.map((cell, cellKey) => {
                  return (
                    <td
                      key={cellKey}
                      {...cell.getCellProps()}
                      className="rt-td"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={classes.pagination}>
        <Pagination
          count={countPageFromTotalAndSize(count, size)}
          page={page + 1}
          onChange={(_, page) => setPage(page - 1)}
          color="primary"
        />
      </div>
    </div>
  );
}

function countPageFromTotalAndSize(total, size) {
  return Math.ceil(total / size);
}

TablePaginate.propTypes = {
  columns: PropTypes.arrayOf(Object),
  data: PropTypes.arrayOf(Object),
  count: PropTypes.number,
  page: PropTypes.number,
  size: PropTypes.number,
  setPage: PropTypes.func,
};
