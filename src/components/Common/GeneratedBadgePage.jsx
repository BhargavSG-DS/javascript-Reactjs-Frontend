import React, { useEffect, useState, useRef } from 'react'; // import useRef
import QRCode from 'react-qr-code';
import ReactToPrint from 'react-to-print';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { Paper, Typography, Button, Container} from '@mui/material';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import clogo from '../../logo.png';

class VisitorBadge extends React.Component {
  render() {
    const { visitorData, visitorImage } = this.props;
    var passphrase = "jsaovnvnaofsofhua3429r20982e2309232098fq093hf".concat(visitorImage).concat("jsdvnkdnovsvlksvnusce843r6987fqw4f");
    const hashedData = CryptoJS.AES.encrypt(JSON.stringify(visitorData), passphrase).toString();

    // // Decrypt
    // var bytes  = CryptoJS.AES.decrypt(encryptedData, passphrase);
    // var originalData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // console.log(originalData); // Logs: original visitorData
    const qrValue = hashedData;

    return (
      <Container >
      <Paper sx={{p:5, borderRadius:'2vh'}} elevation={20}>
        <Avatar alt="OmniActives" src={clogo} sx={{height:'5vh',width:'5vh'}}/>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" component="div" gutterBottom>
            VISITOR PASS
          </Typography>
          <Avatar alt="Visitor" src={visitorImage} sx={{height:'15vh',width:'15vh'}}/>
          <Typography variant="h6" component="div" gutterBottom>
            {visitorData.firstName} {visitorData.lastName}
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            Company: {visitorData.company}
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            Purpose: {visitorData.purpose}
          </Typography>
          <QRCode value={qrValue} size={130} />
        </Box>
      </Paper>
      </Container>
    );
  }
}

const PrintButton = () => {
    const [visitorData, setVisitorData] = useState(null);
    const [visitorImage, setVisitorImage] = useState(null);
    const componentRef = useRef(); // create a ref using useRef
  
    useEffect(() => {
      const data = Cookies.get('visitorData');
      const image = localStorage.getItem('visitorImage');
      if (data) {
        setVisitorData(JSON.parse(data));
        Cookies.remove('visitorData'); // delete the cookie
      }
      if (image) {
        setVisitorImage(image);
        localStorage.removeItem('visitorImage'); // delete the image from local storage
      }
    }, []);
  
    return visitorData && visitorImage ? (
      <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <VisitorBadge ref={componentRef} visitorData={visitorData} visitorImage={visitorImage} />
        <ReactToPrint
          trigger={() => <Button variant="contained" color="primary">Print this out!</Button>}
          content={() => componentRef.current}
        />
      </Stack>
      </Box>
    ) : null;
  };

export default PrintButton;