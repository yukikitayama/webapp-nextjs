import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";

import TablePaginationActions from "./table-pagination-actions";

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const response = await fetch(`${process.env.apiGatewayUrl}/expense`);
      const data = await response.json();
      setExpenses(data.expenses);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - expenses.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clickTableRowHandler = (event, id) => {
    router.push(`/expense/update-item/${id}`);
  };

  return (
    <Box>
      {isLoading && <LinearProgress color="secondary" />}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Place</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? expenses.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : expenses
            ).map((row) => (
              <TableRow
                key={row._id}
                hover={true}
                onClick={(event) => clickTableRowHandler(event, row._id)}
              >
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.place}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 50, 100, { value: -1, label: "All" }]}
                count={expenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}
