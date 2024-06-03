import * as React from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

export default function BadgeSuccess() {
  return (
    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
      Here is a gentle confirmation that your Registration was successful, Please collect your badge. Thank you!
    </Alert>
  );
}