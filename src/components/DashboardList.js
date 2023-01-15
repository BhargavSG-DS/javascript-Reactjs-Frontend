import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
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
import DashboardView from "./DashboardView";
import { Typography } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import PreviewIcon from '@mui/icons-material/Preview';
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Breadcrumb from './Breadcrumbs';

const theme = createTheme({ palette: { mode: "dark" } });

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Fade ref={ref} {...props} />;
});

export default function DashboardList(props) {
	const [token, ] = useContext(UserContext);
	const [DialogOpen, setDialogOpen] = useState(false);
	const [dashboard, setDashboard] = useState("");
	const [itemList, setItemList] = useState(null);

	const baseURL = props.baseURL;
	useEffect(() => {
		const fetchData = async () => {
			axios
				.post(baseURL + "portal/" + props.PortalID + "/dashboard/all?status=submitted&page=1&size=50",{},{headers: {
					'Accept': 'application/json',
					'Authorization' :"Bearer " + token
				}})
				.then((response) => {
					setItemList(response.data.items);
				});
		};
		fetchData();
	}, [baseURL, props, token]);

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleToggle = (ID) => {
		setDashboard(ID);
		setDialogOpen(!DialogOpen);
	};

	return (
		<div>
			<ThemeProvider theme={theme}>
				<div
					style={{
						backgroundColor: "lightBlue",
						width: "84%",
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
								<TableContainer sx={{width:1200}} component={Paper}>
									<Table
										sx={{ minWidth: 65 }}
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
													align="left"
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
													align="center"
												>
													View Details
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{itemList ? (
												itemList.map((item) => (
													<TableRow
														key={item.DashboardID}
														sx={{
															"&:last-child td, &:last-child th":
																{ border: 0 },
														}}
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
																	<PreviewIcon />
																</IconButton>
															</ButtonGroup>
														</TableCell>
													</TableRow>
												))
											) : ""}
										</TableBody>
									</Table>
								</TableContainer>
							</Box>
						</Item>
					</Stack>
				</div>
			</ThemeProvider>
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
				<DashboardView DashboardID={dashboard} baseURL={props.baseURL}/>
			</Dialog>
		</div>
	);
}
