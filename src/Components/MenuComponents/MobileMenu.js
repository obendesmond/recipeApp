import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import uuid from 'uuid';

import Container from '@material-ui/core/Container';
import KitchenIcon from '@material-ui/icons/Kitchen';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FullScreenDialog from './FullScreenDialog';
import defaultImage from '../../Data/defaultImage.jpg'
import selectRecipe from '../../Data/selectRecipe.jpg'
import $ from 'jquery';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  btnGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));


export default function MobileMenu(props){
  const classes = useStyles();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  var now = new Date();
  const [firstDay, setFirstDay] = React.useState(new Date(now.setDate(now.getDate() - now.getDay())))
  const [lastDay, setLastDay] = React.useState(new Date(now.setDate(now.getDate() - now.getDay()+6)))
  const [sevenDays, setSevenDays] = React.useState([]);
  const [nextPrev, setNextPrev] = React.useState(0);
  const { recipeList, menuList, setMenuList } = props;
  const [di, setDi] = React.useState(new Date()); //dummy
  

  React.useEffect(() => {
    get7Days();
  },[di]);

  const dateRange = () => {
    const fd = {
      month: months[firstDay.getMonth()],
      date: firstDay.getDate(),
      year: firstDay.getFullYear()
    }
    const ld = {
      month: months[lastDay.getMonth()],
      date: lastDay.getDate(),
      year: lastDay.getFullYear()
    }

    if(fd.month === ld.month){
      return (
      <h3><b>{`${fd.month} (${fd.date} - ${ld.date}) / ${ld.year}`}</b></h3>
      )
    }

    return (
      <h3><b>{`${fd.month} ${fd.date} - ${ld.month} ${ld.date} / ${ld.year}`}</b></h3>
    )
  }

  const get7Days = (d) => {
    var d = d ? d : new Date();
    const sd = []
    for(let i = 0; i < days.length; i++){
      const date = new Date(d.setDate(d.getDate() - d.getDay()+i));
      const rd = {
        month: months[date.getMonth()],
        day: days[date.getDay()],
        date: date.getDate()
      }
      sd.push(rd);
      // console.log(rd)
    }
    setSevenDays(sd)
  }
  
  // go previous week
  const goLastWeek = () => {
    var d = new Date();
    
    // set next previous week - 7 days
    setNextPrev(nextPrev - 7)

    // set to Monday of this week
    d.setDate(d.getDate() - (d.getDay() + 6) % 7);
    // set to previous Monday
    d.setDate(d.getDate() + nextPrev);

    // create new first and last day
    var firstDay = new Date(d.setDate(d.getDate() - d.getDay()));
    var lastDay = new Date(d.setDate(d.getDate() - d.getDay()+6));
    
    // set new first and last day to change the range
    setFirstDay(firstDay);
    setLastDay(lastDay);

    get7Days(d)
  }

  // go next week
  const goNextWeek = () => {
    var d = new Date();
    // set next next week + 7 days
    setNextPrev(nextPrev + 7)

    // set to Monday of this week
    d.setDate(d.getDate() - (d.getDay() + 6) % 7);

    // set to previous Monday
    d.setDate(d.getDate() + nextPrev);
    
    // create new first and last day
    var firstDay = new Date(d.setDate(d.getDate() - d.getDay()));
    var lastDay = new Date(d.setDate(d.getDate() - d.getDay()+6));
    
    // set new first and last day to change the range
    setFirstDay(firstDay);
    setLastDay(lastDay);
    get7Days(d)
  }
  
  const handleSelectRecipe = (name, meal) => {
    var newMeal = {}
    if(meal.mealType === 0){
      if(meal.breakfast){
        meal.breakfast.recipe = name;
        newMeal = meal.breakfast; 
      } else {
        newMeal = {
          id:uuid(),
          recipe:name,
          type:'BreakFast',
          dateInfo: meal.dateInfo
        }
      }
    }
    if(meal.mealType === 1){
      if(meal.launch){
        meal.launch.recipe = name;
        newMeal = meal.launch; 
      } else {
        newMeal = {
        id:uuid(),
        recipe:name,
        type:'Launch',
          dateInfo: meal.dateInfo
        }
      }
    }
    if(meal.mealType === 2){
      if(meal.supper){
        meal.supper.recipe = name;
        newMeal = meal.supper; 
      } else {
        newMeal = {
          id:uuid(),
          recipe:name,
          type:'Supper',
          dateInfo: meal.dateInfo
        }
      }
    } 

    const index = menuList.findIndex((m) => m.id === newMeal.id)
    console.log(index)
    var ml = [];
    if(index >= 0){
      ml = [...menuList]
      ml[index] = newMeal;
    }
    else {
      ml = [...menuList, newMeal];
    }
    setMenuList(ml);
  }

  // scroll to present Day
  window.onload = function() {
    $(document).ready(function () {
      var target_offset = $('#presentDay').offset(),
      target_top = target_offset.top;
      $('html, body').animate({
          scrollTop: target_top
      }, 800);
  });
  }

  return (
    <Container style={{marginTop:'100px'}}>
          <div className={classes.btnGroup}>
            <ButtonGroup color="secondary" aria-label="outlined secondary button group">
              <Button onClick={() => goLastWeek()}>
                <ArrowBackIosIcon />
              </Button>
              <Button>
                {dateRange()}
              </Button>
              <Button onClick={() => goNextWeek()}>
                <ArrowForwardIosIcon />
              </Button>
            </ButtonGroup>
          </div>
        <VerticalTimeline >
          {
            sevenDays.map((d, i) => {
              const n = new Date();
              const check = ((days[n.getDay()] === d.day && n.getDate() === d.date) ? true : false);
              const date = (f) => {
                if(check)
                  return <span style={{color:'red'}}>{f}</span>
                else return <span>{f}</span>
              }
              
              const meal = {}

              menuList.map((menu, j) => {
                const pmenu = {
                  month: months[menu.dateInfo.month],
                  day: days[menu.dateInfo.day],
                  date: menu.dateInfo.date
                }
                if(pmenu.month === d.month && pmenu.date === d.date){
                  if(menu.type === "BreakFast"){
                    meal.breakfast = menu
                  } else if(menu.type === "Launch"){
                    meal.launch = menu
                  } else {
                    meal.supper = menu
                  }
                }
                  meal.dateInfo = {
                    month: months.indexOf(d.month),
                    day: days.indexOf(d.day),
                    date: d.date
                  }
              })

              return (
                <React.Fragment key={i}>
                  {
                    check ?
                    <div id='presentDay' style={{marginBottom:'50px'}}></div> : null
                  }
                  <VerticalTimelineElement
                    // id = {check ? 'presentDay' : ''}
                    className="vertical-timeline-element--work"
                    date={date('Break Fast')}
                    iconStyle={{  background: 'rgb(34, 76, 26)', color: '#fff' }}
                    icon={<KitchenIcon />}
                  >
                    {
                        check 
                        ? (
                          <React.Fragment>
                            <h1 style={{color:'green'}}>{`${d.day} - ${d.date}`}</h1>
                            <h2 className="vertical-timeline-element-title">
                              {
                                meal.breakfast ? meal.breakfast.recipe : 'Select Recipe!!'
                              }  
                            </h2><br />
                          </React.Fragment>
                        )
                        : (
                          <React.Fragment>
                            <h1 style={{color:'lightgrey'}} >{`${d.day} - ${d.date}`}</h1>
                            <h2 style={{color:'lightgrey'}} className="vertical-timeline-element-title">
                              {
                                meal.breakfast ? meal.breakfast.recipe : 'Select Recipe!!'
                              }    
                            </h2><br />
                          </React.Fragment>
                        )
                    }
                    {
                      meal.breakfast 
                      ? (<img style={{height:'auto', width:'100%'}} alt='no-image' src={defaultImage} />)
                      : <img style={{height:'auto', width:'100%'}} alt='no-image' src={selectRecipe} />
                    }
                    <FullScreenDialog  meal={meal} mealType={0} selectRecipe={handleSelectRecipe} recipeList={recipeList} />
                  </VerticalTimelineElement>
                  <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date={date('Launch')}
                    iconStyle={{  background: 'rgb(34, 76, 26)', color: '#fff' }}
                    // icon={<KitchenIcon />}
                  >
                    {
                        check 
                        ? (
                          <React.Fragment>
                            <h2 className="vertical-timeline-element-title">
                              {
                                meal.launch ? meal.launch.recipe : 'Select Recipe!!'
                              }  
                            </h2><br />
                          </React.Fragment>
                        )
                        : (
                          <React.Fragment>
                            <h2 style={{color:'lightgrey'}} className="vertical-timeline-element-title">
                              {
                                meal.launch ? meal.launch.recipe : 'Select Recipe!!'
                              }   
                            </h2><br />
                          </React.Fragment>
                        )
                    }
                    {
                      meal.launch 
                      ? (<img style={{height:'auto', width:'100%'}} alt='no-image' src={defaultImage} />)
                      : <img style={{height:'auto', width:'100%'}} alt='no-image' src={selectRecipe} />
                    }
                    <FullScreenDialog  meal={meal} mealType={1} selectRecipe={handleSelectRecipe} recipeList={recipeList} />
                  </VerticalTimelineElement>
                  <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date={date('Supper')}
                    iconStyle={{  background: 'rgb(34, 76, 26)', color: '#fff'}}
                    // icon={<KitchenIcon />}
                  >
                    {
                        check 
                        ? (
                          <React.Fragment>
                            <h2 className="vertical-timeline-element-title">
                              {
                                meal.supper ? meal.supper.recipe : 'Select Recipe!!'
                              } 
                            </h2><br />
                          </React.Fragment>
                        )
                        : (
                          <React.Fragment>
                            <h2 style={{color:'lightgrey'}} className="vertical-timeline-element-title">
                              {
                                meal.supper ? meal.supper.recipe : 'Select Recipe!!'
                              }   
                            </h2><br />
                          </React.Fragment>
                        )
                    }
                    {
                      meal.supper 
                      ? (<img style={{height:'auto', width:'100%'}} alt='no-image' src={defaultImage} />)
                      : <img style={{height:'auto', width:'100%'}} alt='no-image' src={selectRecipe} />
                    }
                    <FullScreenDialog  meal={meal} mealType={2} selectRecipe={handleSelectRecipe} recipeList={recipeList} />
                  </VerticalTimelineElement>
                  <hr />
                </React.Fragment>
              )
            })
          }

          <VerticalTimelineElement
            iconStyle={{ background: 'rgb(34, 76, 26)', color: '#fff' }}
            icon={<KitchenIcon />}
          />
        </VerticalTimeline>
    </Container>
  )
}