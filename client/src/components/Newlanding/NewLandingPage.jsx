import { BackgroundVectorIcon } from './HeaderVectorIcon';
import { BackgroundVectorIcon2 } from './FooterVectorIcon';
import { Ellipse1Icon } from './EllipseIcon';
import { Group5Icon } from './Group5icon';
import { Line1Icon } from './Line1icon';
import { Line2Icon } from './Line2icon';
import classes from './NewLandingPage.css';


export default function NewLandingPage(props){
  return (
    
    <div className={classes.root}>
      <div className={classes.frameForButtons}>
        <div className={classes.buttonForCreate}>
          <div className={classes.createAnAccountBox}></div>
          <div className={classes.createAnAccountText}>Create an account</div>
        </div>
        <div className={classes.buttonForLogin}>
          <div className={classes.greenRectangleForLogin}></div>
          <div className={classes.loginText}>Login</div>
        </div>
      </div>
      <div className={classes.alrdyHaveAnAccText}>already have an account?</div>
      <div className={classes.line2}>
        <Line2Icon className={classes.icon} />
      </div>
      <div className={classes.line1}>
        <Line1Icon className={classes.icon2} />
      </div>
      <div className={classes.descriptionText}>
        <span className={classes.labelWrapper}>
          <span className={classes.label}>
            Just fill out some stuff for us real quick and we’ll get you on your way! Welcome to the{' '}
          </span>
          <span className={classes.label2}>milestone</span>
          <span className={classes.label3}> community.</span>
        </span>
      </div>
      <div className={classes.backgroundVector}>
        <BackgroundVectorIcon className={classes.icon3} />
      </div>
      <div className={classes.backgroundVector2}>
        <BackgroundVectorIcon2 className={classes.icon4} />
      </div>
      <div className={classes.ellipse1}>
        <Ellipse1Icon className={classes.icon5} />
      </div>
      <div className={classes.group5}>
        <Group5Icon className={classes.icon6} />
      </div>
      <div className={classes.logoText}>milestone</div>
    </div>
  );
};
