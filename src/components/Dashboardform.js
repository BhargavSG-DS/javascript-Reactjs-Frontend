import React, { useState, useEffect ,useContext} from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { UserContext } from "../context/UserContext";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import ButtonGroup from "@mui/material/ButtonGroup";
import DashboardAdd from "./DashboardAdd";
import { Typography } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DashboardEdit from "./DashboardEdit";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import Breadcrumb from './Breadcrumbs';

const theme = createTheme({ palette: { mode: "dark" } });

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));


const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Fade ref={ref} {...props} />;
});

export default function Dashboardform(props) {
	const [token, ] = useContext(UserContext);
	const [DialogOpen, setDialogOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [dashboard, setDashboard] = useState("");
	const [itemList, setItemList] = useState(null);

	const refresh = () => {
		window.location.reload();
	};

	const baseURL = props.baseURL;
	useEffect(() => {
		const fetchData = async () => {
			axios
				.post(baseURL + "portal/" + props.PortalID + "/dashboard/all",{},{headers: {
					'Accept': 'application/json',
					'Authorization' :"Bearer " + token
				}})
				.then((response) => {
					setItemList(response.data.items);
				});
		};
		fetchData();
	}, [baseURL, props, token]);

	const handleDelete = (id) => {
		alert("Delete " + id + " ?");
		axios
			.delete(baseURL + "dashboard/" + id + "/delete")
			.then((response) => {
				setMessage("Dashboard detail Successfully Deleted.");
				setOpen(true);
			});
	};


	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
		refresh();
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleToggle = (ID) => {
		setDashboard(ID);
		setDialogOpen(!open);
	};

	return (
		<div>
			<ThemeProvider theme={theme}>
				<div
					style={{
						backgroundColor: "lightBlue",
						width: "78%",
						margin: "auto",
					}}
				>
					<h1 style={{ textAlign: "center", padding: 10 }}>
						Dashboard List
					<Breadcrumb CurrentPage = {props.CurrentPage}/>
					</h1>
				</div>

				<div style={{ display: "flex", justifyContent: "center" }}>
					<Stack spacing={2}>
					<Item>
							<Box
								style={{
									margin: 10,
									border: "solid black 1px",
									backgroundColor: "lightblue",
								}}
							>
								<TableContainer sx={{width:1100}} component={Paper}>
									<Table
										sx={{ minWidth: 70 }}
										aria-label="Dashboards table"
									>
										<TableHead>
											<TableRow
												sx={{
													backgroundColor:
														"lightBlue",
												}}
											>
												<TableCell
													sx={{
														fontSize: 16,
														color: "black",
														fontWeight: "bold",
													}}
													align="left"
												>
													Open
												</TableCell>
												<TableCell
													sx={{
														fontSize: 16,
														color: "black",
														fontWeight: "bold",
													}}
													align="left"
												>
													Dashboard ID
												</TableCell>
												
												<TableCell
													sx={{
														fontSize: 16,
														color: "black",
														fontWeight: "bold",
													}}
													align="center"
												>
													Dashboard Name & Description
												</TableCell>

												<TableCell
													sx={{
														fontSize: 16,
														color: "black",
														fontWeight: "bold",
													}}
													align="left"
												>
													ElementType
												</TableCell>
												<TableCell
													sx={{
														fontSize: 16,
														color: "black",
														fontWeight: "bold",
													}}
													align="left"
												>
													Status
												</TableCell>
												<TableCell
													sx={{
														fontSize: 16,
														color: "black",
														fontWeight: "bold",
													}}
													align="center"
												>
													Action
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{itemList ? (
												itemList.map((item) => (
													<TableRow
														key={item.DashboardID}
													>
														<TableCell align="left">
															
															<a
																href={
																	item.UIURL
																}
																rel="noreferrer"
																target="_blank"
															>
																<IconButton>
																	
																	<FileOpenIcon />
																</IconButton>
															</a>
														</TableCell>
														<TableCell align="left">
															{item.DashboardID}
														</TableCell>
														<TableCell align="left">
														<Accordion style={{width:400}}>
															<AccordionSummary
															expandIcon={<ExpandMoreIcon />}
															aria-controls="panel1a-content"
															id="panel1a-header"
															>
															<Typography>{item.DashboardName}</Typography>
															</AccordionSummary>
															<AccordionDetails>
															<Typography>
																{item.DisplayDesc}
															</Typography>
															</AccordionDetails>
														</Accordion>
														</TableCell>
														<TableCell align="left">
															{item.ElementType}
														</TableCell>
														<TableCell align="center">
															{item.Status==="submitted"?<PublishedWithChangesOutlinedIcon/>:<UnpublishedOutlinedIcon/>}
														</TableCell>
														<TableCell align="center">
															<ButtonGroup
																desableElevation
																varient="contained"
															>
																<IconButton
																	aria-label="upload picture"
																	component="span"
																	onClick={() =>
																		handleToggle(
																			item.DashboardID
																		)
																	}
																>
																	<EditRoundedIcon />
																</IconButton>
																<IconButton
																	color="error"
																	aria-label="upload picture"
																	component="span"
																	onClick={() =>
																		handleDelete(
																			item.DashboardID
																		)
																	}
																>
																	<DeleteRoundedIcon />
																</IconButton>
															</ButtonGroup>
														</TableCell>
													</TableRow>
												))
											) :''}
										</TableBody>
									</Table>
								</TableContainer>
							</Box>
						</Item>
						<div
							style={{
								backgroundColor: "lightBlue",
								marginTop: 20
							}}
						>
							<h1 style={{ textAlign: "center", padding: 10 }}>
								Dashboard Upload
							</h1>
						</div>
						<Item>
							<DashboardAdd baseURL={baseURL}/>
						</Item>
					</Stack>
				</div>
			</ThemeProvider>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity="success"
					sx={{ width: "100%" }}
				>
					{message}
				</Alert>
			</Snackbar>
			<Dialog
				fullScreen
				open={DialogOpen}
				TransitionComponent={Transition}
				style={{ backgroundColor: "DarkGrey" }}
				onClose={() => handleDialogClose()}
			>
				<div>
					<IconButton
						onClick={() => handleDialogClose()}
						sx={{ position: "static", top: 0, left: 0 }}
					>
						<CloseIcon sx={{ color: "black" }} />
					</IconButton>
				</div>
				<DashboardEdit DashboardID={dashboard} baseURL={baseURL} />
			</Dialog>
		</div>
	);
}
