import { MenuItem, Select, Box, TextField, Button, Container, InputLabel } from "@material-ui/core";
import { useForm } from "react-hook-form";
import countryList from "react-select-country-list";
import { useMemo, useState } from "react";

export const OrderForm = props => {
  const countryOptions = useMemo(() => countryList().getData(), []);
  const [countryValue, setCountryValue] = useState();

  const changeHandler = value => {
    setCountryValue(value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <Container maxWidth="md">
      <Box p={1} display="flex" flexDirect="row" justifyContent="center" style={{ width: "auto" }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <form onSubmit={handleSubmit(onSubmit)}>
            {errors.email && errors.email.message}
            <Box p={1} display="flex" alignItems="center" justifyContent="center">
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                style={{ minWidth: "250px" }}
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid Email",
                  },
                })}
              />
            </Box>
            {errors.firstName && <p>First name is required</p>}
            <Box p={1} display="flex" alignItems="center" justifyContent="center">
              <TextField
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                style={{ minWidth: "250px" }}
                {...register("firstName", { required: true })}
              />
            </Box>
            {errors.lastName && <p>Last name is required</p>}
            <Box p={1} display="flex" alignItems="center" justifyContent="center">
              <TextField
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                style={{ minWidth: "250px" }}
                {...register("lastName", { required: true })}
              />
            </Box>
            {errors.address && <p>Postal Address is required</p>}
            <Box p={1}>
              <TextField
                id="outlined-basic"
                label="Address"
                variant="outlined"
                style={{ minWidth: "250px" }}
                {...register("address", { required: true })}
              />
            </Box>
            {errors.city && <p>City is required</p>}
            <Box p={1}>
              <TextField
                id="outlined-basic"
                label="City"
                variant="outlined"
                style={{ minWidth: "250px" }}
                {...register("city", { required: true })}
              />
            </Box>
            {errors.country && <p>Country is required</p>}
            <Box p={1}>
              <InputLabel id="demo-mutiple-name-label">Country</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={countryValue}
                onChange={changeHandler}
                label="Country"
                style={{ minWidth: "250px" }}
                {...register("country", { required: true })}
              >
                {countryOptions.map(({ label, value }, i) => {
                  return (
                    <MenuItem key={i} value={value} style={{ minWidth: "250px" }}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>
            <Box p={1}>
              <TextField
                id="outlined-basic"
                label="State"
                variant="outlined"
                style={{ minWidth: "250px" }}
                {...register("state")}
              />
            </Box>
            {errors.zip && <p>Zip is required</p>}
            <Box p={1}>
              <TextField
                id="outlined-basic"
                label="Zip"
                variant="outlined"
                style={{ minWidth: "250px" }}
                {...register("zip", { required: true })}
              />
            </Box>
            <Box p={1}>
              <TextField
                id="outlined-basic"
                label="Phone"
                variant="outlined"
                style={{ minWidth: "250px" }}
                {...register("phone")}
              />
            </Box>
            <Box p={1}>
              <Button variant="contained" color="primary" className="connect-button" type="submit">
                Submit Order
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderForm;
