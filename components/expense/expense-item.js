import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Stack,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
  LinearProgress,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import { expenseItems, expenseTypes } from "../../helper/expense-util";

export default function ExpenseItem() {
  const [date, setDate] = useState(new Date());
  const [item, setItem] = useState("grocery");
  const [type, setType] = useState("normal");
  const [amount, setAmount] = useState();
  const [place, setPlace] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const idToken = useSelector((state) => state.auth.token);
  const router = useRouter();

  // If query has id, expense-item component appear by clicking a row of the existing expense items
  // If query doesn't have id, just adding a new expense item
  useEffect(() => {
    if (router.query.id) {
      const fetchData = async () => {
        const response = await fetch(`${process.env.apiGatewayUrl}/expense?id=${router.query.id}`);
        const expenseData = await response.json();
        const expense = expenseData.expense;

        setDate(expense.date);
        setItem(expense.item);
        setType(expense.type);
        setAmount(expense.amount);
        setPlace(expense.place);
        setMemo(expense.memo);
      };

      setIsSubmitting(true);
      fetchData();
      setIsSubmitting(false);
    }
  }, [router.query.id]);

  const dateChangeHandler = (newValue) => {
    setDate(newValue);
  };
  const itemChangeHandler = (event) => {
    setItem(event.target.value);
  };
  const typeChangeHandler = (event) => {
    setType(event.target.value);
  };
  const amountChangeHandler = (event) => {
    setAmount(event.target.value);
  };
  const placeChangeHandler = (event) => {
    setPlace(event.target.value);
  };
  const memoChangeHandler = (event) => {
    setMemo(event.target.value);
  };

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    
    // Do this extra step since DATE.toISOString() does not returns YYYY-MM-DD in UTC, but I want it in local timezone
    // Get date string in format YYYY-MM-DD in the local timezone
    // getTime() returns milliseconds since Unix Epoch
    // getTimezoneOffset() returns minutes from UTC
    // Newly created Date object has the same date and time, but in UTC
    const yyyyMmDd = (new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)).toISOString().split("T")[0];

    // expense/update path is authenticated to webapp-nextjs Congnito
    const response = await fetch(`${process.env.apiGatewayUrl}/expense/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // This authorization is configured by Amazon Cognito and Amazon API Gateway
        "Authorization": idToken
      },
      body: JSON.stringify({
        date: yyyyMmDd,
        item: item,
        type: type,
        amount: amount,
        place: place,
        memo: memo,
      }),
    });

    response
      .json()
      .then((data) => {
        setIsSubmitting(false);
        router.push('/expense');
      })
      .catch((error) => {
        setIsSubmitting(false);
        alert(`Error: ${error}`);
      });
  };

  return (
    <Fragment>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item sx={{ width: { xs: "100%", md: "70%" }, mt: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form onSubmit={formSubmissionHandler}>
              <Card>
                <CardHeader title="Add New Item" />
                <CardContent>
                  <Stack spacing={1}>
                    <DesktopDatePicker
                      label="Date *"
                      inputFormat="MM/dd/yyyy"
                      value={date}
                      onChange={dateChangeHandler}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          helperText={params?.inputProps?.placeholder}
                        />
                      )}
                    />
                    <FormControl fullWidth>
                      <InputLabel id="item-label">Item *</InputLabel>
                      <Select
                        labelId="item-label"
                        value={item}
                        label="Item *"
                        onChange={itemChangeHandler}
                      >
                        {expenseItems.map((expenseItem) => (
                          <MenuItem
                            key={expenseItem.value}
                            value={expenseItem.value}
                          >
                            {expenseItem.item}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Required</FormHelperText>
                    </FormControl>
                    <FormControl>
                      <InputLabel id="type-label">Type *</InputLabel>
                      <Select
                        labelId="type-label"
                        value={type}
                        label="Type *"
                        onChange={typeChangeHandler}
                      >
                        {expenseTypes.map((expenseType) => (
                          <MenuItem
                            key={expenseType.value}
                            value={expenseType.value}
                          >
                            {expenseType.item}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Required</FormHelperText>
                    </FormControl>
                    <TextField
                      label="Amount"
                      variant="outlined"
                      required
                      // type="number"
                      inputProps={{ inputMode: "numeric", pattern: "[0-9.]*" }}
                      helperText="Required"
                      defaultValue={amount}
                      onChange={amountChangeHandler}
                    />
                    <TextField
                      label="Place"
                      variant="outlined"
                      required
                      helperText="Required"
                      defaultValue={place}
                      onChange={placeChangeHandler}
                    />
                    <TextField
                      label="Memo"
                      variant="outlined"
                      defaultValue={memo}
                      onChange={memoChangeHandler}
                    />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={!isAuth}
                    >
                      Submit
                    </Button>
                    <Link href="/expense" passHref>
                      <Button variant="contained" color="warning">
                        Cancel
                      </Button>
                    </Link>
                  </Stack>
                </CardActions>
                {isSubmitting && <LinearProgress color="secondary" />}
              </Card>
            </form>
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Fragment>
  );
}
