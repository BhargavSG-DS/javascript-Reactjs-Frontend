import React, { useState,useContext} from "react";
import { UserContext } from "../context/UserContext";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Button from "@mui/material/Button";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Grid from "@mui/material/Grid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const theme = createTheme({ palette: { mode: "dark" } });

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));

const Input = styled("input")({
	display: "None",
});

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function DashboardAdd(props) {
	const [open, setOpen] = useState(false);
	const [token, ] = useContext(UserContext);
	const [alertType,setAlertType] = useState('');
	const [message, setMessage] = useState("");
	const [dashboardImage, setDasboardImage] = useState("");
	const [dashboardID, setDashboardID] = useState("");
	const [dashboardName, setDashboardName] = useState("");
	const [displayDesc, setDisplayDesc] = useState("");
	const [elementType, setElementType] = useState("");
	const [uiURL, setUIURL] = useState("");
	const [focusURL, setFocusURL] = useState("");
	const [excelFile, setExcelFile] = useState("");
	const [fileUplaodDisable, setFileUploadDisable] = useState(false);
	const [img, setImg] = useState();

	const refresh = () => {
		window.location.reload();
	};

	const baseURL = props.baseURL;


	function UploadDashboard(info) {
		axios
			.post(
				baseURL + "portal/" + props.PortalID + "/dashboard/upload",
				info,
				{headers:{
					"Content-Type" : "application/json",
					'Authorization' :"Bearer " + token,
				}}
			)
			.then((response) => {
				UploadImage(response.data.data);
			});
	}

	const handleClick = () => {
		setFileUploadDisable(true);
	};

	const handleExcelFile = () => {
		let formData = new FormData();
		formData.append("file", excelFile);
		axios
			.post(baseURL + "uploadExcel", formData, {
				headers: {
					"Accept": "application/json",
					"Content-Type": "multipart/form-data"
				},
			})
			.then((response) => {
				setMessage(response.data.detail);
				setAlertType('success');
				setOpen(true);
			})
			.catch((response) => {
				setMessage(response.data.detail);
				setAlertType('error');
				setOpen(true);
			});
	};

	function UploadImage() {
		let formData = new FormData();
		formData.append("file", dashboardImage);
		axios
			.post(baseURL + "dashboard/" + dashboardID + "/Image", formData, {
				headers: {
					Accept: "application/json",
					"Content-Type": "multipart/form-data",
					'Authorization' :"Bearer " + token,
				},
			})
			.then((response) => {
				setMessage("Dashboard detail Successfully Uploaded.");
				setAlertType('success');
				setOpen(true);
			})
			.catch((response) => {
				setMessage(response.data.detail);
				setAlertType('error');
				setOpen(true);
			});
	}

	const makeDasboardImage = (e) => {
		setDasboardImage(e.target.files[0]);
		setImg(URL.createObjectURL(e.target.files[0]));
	};

	const handleAction = (value) => {
		if (excelFile === "") {
			if (value === "Submit") {
				const postData = {
					DashboardName: dashboardName,
					DisplayDesc: displayDesc,
					UIURL: uiURL,
					FocusURL: focusURL,
					Status: "submitted",
					DashboardID: dashboardID,
					ElementType: elementType,
				};
				UploadDashboard(postData);
			} else if (value === "Save") {
				const postData = {
					DashboardName: dashboardName,
					DisplayDesc: displayDesc,
					UIURL: uiURL,
					FocusURL: focusURL,
					Status: "saved",
					DashboardID: dashboardID,
					ElementType: elementType,
				};
				UploadDashboard(postData);
			}
		} else {
			handleExcelFile();
		}
	};
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
		refresh();
	};

	const handleClear = () => {
		setFileUploadDisable(false);
        setDashboardID("");
        setDashboardName("");
        setElementType("");
        setUIURL("");
        setFocusURL("");
        setDisplayDesc("");
        setImg();
	};

	return (
		<div>
            
			<ThemeProvider theme={theme}>

						
							<h2 style={{ textAlign: "center" }}>
								Enter Dashboard Details
							</h2>
							<Grid container spacing={2}>
								<Grid item xs={4}>
									<Stack spacing={2}>
										<Item>
											<TextField
												fullWidth
												required
												size="small"
												id="DashboardID"
												label="Dashboard ID"
												color="primary"
                                                value={dashboardID}
												onChange={(e) =>
													setDashboardID(
														e.target.value
													)
												}
												onClickCapture={(e) =>
													handleClick()
												}
											/>
										</Item>
										<Item>
											<TextField
												required
												fullWidth
												size="small"
												id="DashboardName"
												label="Dashboard Name"
												color="primary"
                                                value={dashboardName}
												onChange={(e) =>
													setDashboardName(
														e.target.value
													)
												}
											/>
										</Item>
										<Item>
											<TextField
												size="small"
												fullWidth
												required
												id="ElementType"
												label="Element Type"
												color="primary"
                                                value={elementType}
												onChange={(e) =>
													setElementType(
														e.target.value
													)
												}
											/>
										</Item>
										<Item>
											<TextField
												required
												fullWidth
												size="small"
												id="UIURL"
												label="UI URL"
												color="primary"
                                                value={uiURL}
												onChange={(e) =>
													setUIURL(e.target.value)
												}
											/>
										</Item>
										<Item>
											<TextField
												fullWidth
												required
												size="small"
												id="FocusURL"
												label="Focus URL"
												color="primary"
                                                value={focusURL}
												onChange={(e) =>
													setFocusURL(e.target.value)
												}
											/>
										</Item>
										<Item>
											<label htmlFor="contained-button-file">
												<Button
													id="Excel-Button"
													sx={{
														display: "flex",
														justifyContent:
															"center",
													}}
													variant="outlined"
													color="primary"
													indicatorColor="primary"
													component="label"
													disabled={fileUplaodDisable}
												>
													<Input
														hidden
														accept=".xlsx"
														id="excel-data"
														type="file"
														onChange={(e) =>
															setExcelFile(
																e.target.files[0]
															)
														}
													/>
													<UploadFileIcon /> Import From Excel
												</Button>
											</label>
										</Item>
									</Stack>
								</Grid>
								<Grid item xs={4}>
									<Stack spacing={2}>
										<Item sx={{height:185}}>
											<img
												src={
													img?img:require("./static/dashboard/DashboardDefault.jpg")
												}
												alt="Dashboard-Preview"
												height={170}
												style={{
													border: "solid white .1px"
												}}
											/>
										</Item>
										<Item>
											<label htmlFor="Dashboard-Image">
												<Button
													sx={{
														display: "flex",
														justifyContent:
															"center",
														padding: 0.89,
													}}
													color="primary"
													aria-label="Dashboard-Image"
													variant="outlined"
													indicatorColor="primary"
													component="label"
												>
													<Input
														hidden
														accept="image/*"
														id="Dashboard-Image"
														type="file"
														onChange={(e) =>
															makeDasboardImage(e)
														}
													/>
													<AddPhotoAlternateIcon />
													Upload Dashboard Image
												</Button>
											</label>
										</Item>
										<Item>
											<label htmlFor="contained-button-file">
												<Button
													sx={{
														display: "flex",
														justifyContent:
															"center",
													}}
													variant="outlined"
													color="primary"
													indicatorColor="primary"
													onClick={() =>
														handleClear()
													}
													component="span"
												>
													<ClearAllIcon /> Clear
												</Button>
											</label>
										</Item>
									</Stack>
								</Grid>
								<Grid item xs={4}>
									<Stack container spacing={2}>
										<Item item>
											<TextField
												size="small"
												required
												id="outlined-required"
												label="Description"
												minRows={10.5}
												multiline
												fullWidth
												color="primary"
                                                value={displayDesc}
												onChange={(e) =>
													setDisplayDesc(
														e.target.value
													)
												}
											/>
										</Item>
										<Grid container spacing={8}>
											<Grid xs={5}>
												<Item>
													<label htmlFor="contained-button-file">
														<Button
															sx={{
																display: "flex",
																justifyContent:
																	"center",
															}}
															variant="outlined"
															color="primary"
															indicatorColor="primary"
															onClick={() =>
																handleAction(
																	"Save"
																)
															}
															component="span"
														>
															Save
														</Button>
													</label>
												</Item>
											</Grid>
											<Grid xs={5}>
												<Item>
													<label htmlFor="contained-button-file">
														<Button
															sx={{
																display: "flex",
																justifyContent:
																	"center",
															}}
															variant="outlined"
															color="primary"
															indicatorColor="primary"
															onClick={() =>
																handleAction(
																	"Submit"
																)
															}
															component="span"
														>
															SUBMIT
														</Button>
													</label>
												</Item>
											</Grid>
										</Grid>
									</Stack>
								</Grid>
							</Grid>
						
			</ThemeProvider>
			<Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity={alertType}
					sx={{ width: "100%" }}
				>
					{message}
				</Alert>
			</Snackbar>
		</div>
	);
}
