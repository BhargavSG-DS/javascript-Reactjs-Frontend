import FaceDetectionWebcam from '../Common/PhotoScan';
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PhotoAnalyze from '../Common/PhotoAnalyze';
import VisitorForm from '../Common/DetailsPage';
import PrintButton from '../Common/GeneratedBadgePage';
import BadgeSuccess from '../Badge';

const steps = ['Photo Scan', 'Photo Analyze','Details Form', 'Identity Badge'];

export default function CheckIn(Props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
//   const steps = Props.stepList;

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <FaceDetectionWebcam />;
      case 1:
        return <PhotoAnalyze />;
      case 2:
        return <VisitorForm parentSubmit={handleComplete}/>;
      case 3:
        return <PrintButton />;
      default:
        return 'Unknown step';
    }
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={8}>
      <Stepper nonLinear activeStep={activeStep} mb={20} sx={{position:'parent' , top: 0, px: 6}}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div >
        {allStepsCompleted() ? (
          <React.Fragment>
           <BadgeSuccess />
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button href='/' onClick={handleReset}>Finish</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2}}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 ,position:'parent',left : 0, botton:0}}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete} sx={{position:'parent',right : 0, botton:0}}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Check'
                      : 'Next'}
                  </Button>
                ))}
            </Box>

          </React.Fragment>
        )}
      </div>
     </Stack>
    </Box>
  );
}

