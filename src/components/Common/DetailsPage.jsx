import React from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Cookies from 'js-cookie';
import Grid from '@mui/material/Grid';


const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phoneNumber: yup.string().matches(/^[0-9]+$/, "Must be only digits").min(10, 'Must be exactly 10 digits').max(10, 'Must be exactly 10 digits').required('Phone number is required'),
  age: yup.number().required('Age is required').positive().integer(),
  company: yup.string(),
  purpose: yup.string().required('Purpose of visit is required'),
  description: yup.string().required('Description of visit is required'),
  host: yup.string().required('Host name is required'),
});

const VisitorForm = (props) => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      age: '',
      company: '',
      purpose: '',
      description: '',
      host: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
    Cookies.set('visitorData', JSON.stringify(values));
    props.parentSubmit();
    },
  });

  return (
    <Paper sx={{borderRadius:'2vh', px:2 , mx : 2, py : 2}} elevation={2} variant='outlined'>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Please fill in the required details.
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center">
        We assure you, information you provide is safe. 
        Please press submit after completion.
      </Typography>
    <form onSubmit={formik.handleSubmit}>
    <Grid container justifyContent="space-around" alignItems="stretch" spacing={1}>
    <Grid item xs={5}>
      <TextField
        fullWidth
        id="firstName"
        name="firstName"
        label="First Name"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
        sx={{mb:2}}
      />
        </Grid>
        <Grid item xs={5}>
      <TextField
        fullWidth
        id="lastName"
        name="lastName"
        label="Last Name"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
        sx={{mb:2}}
      />
      </Grid>
      <Grid item xs={2}>
      <TextField
        fullWidth
        id="age"
        name="age"
        label="Age"
        value={formik.values.age}
        onChange={formik.handleChange}
        error={formik.touched.age && Boolean(formik.errors.age)}
        helperText={formik.touched.age && formik.errors.age}
        sx={{mb:2}}
      />
      </Grid>
      </Grid>
      <Grid container justifyContent="space-evenly" alignItems="stretch" spacing={1}>
      <Grid item xs={8}>
      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        sx={{mb:2}}
      />
        </Grid>
        <Grid item xs={4}>
      <TextField
        fullWidth
        id="phoneNumber"
        name="phoneNumber"
        label="Phone Number"
        value={formik.values.phoneNumber}
        onChange={formik.handleChange}
        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
        sx={{mb:2}}
      />
    </Grid>
        </Grid>
        <Grid container justifyContent="space-evenly" alignItems="stretch" spacing={1}>
        <Grid item xs={6}>
      <TextField
        fullWidth
        id="company"
        name="company"
        label="Company"
        value={formik.values.company}
        onChange={formik.handleChange}
        error={formik.touched.company && Boolean(formik.errors.company)}
        helperText={formik.touched.company && formik.errors.company}
        sx={{mb:2}}
      />
        </Grid>
        <Grid item xs={6}>
        <TextField
        fullWidth
        id="host"
        name="host"
        label="Host Name"
        value={formik.values.host}
        onChange={formik.handleChange}
        error={formik.touched.host && Boolean(formik.errors.host)}
        helperText={formik.touched.host && formik.errors.host}
        sx={{mb:2}}
      />
      </Grid>
        </Grid>
      <TextField
        fullWidth
        id="purpose"
        name="purpose"
        label="Purpose of Visit"
        value={formik.values.purpose}
        onChange={formik.handleChange}
        error={formik.touched.purpose && Boolean(formik.errors.purpose)}
        helperText={formik.touched.purpose && formik.errors.purpose}
        sx={{mb:2}}
      />
      <TextField
        fullWidth
        id="description"
        name="description"
        label="Brief Description"
        value={formik.values.description}
        onChange={formik.handleChange}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        sx={{mb:2}}
        />
      <Button color="primary" variant="contained" fullWidth type="submit">
        Confirm
      </Button>
    </form>
    </Paper>
  );
};

export default VisitorForm;
