import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import uuid from 'uuid';

import Container from '@material-ui/core/Container';
import KitchenIcon from '@material-ui/icons/Kitchen';

import FullScreenDialog from '../Components/MenuComponents/FullScreenDialog';

import {getMenuList} from '../Libs/ApiLib';
import defaultImage from '../Data/defaultImage.jpg'
import selectRecipe from '../Data/selectRecipe.jpg'


export default function Menu(props){
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  var now = new Date();
  const [firstDay, setFirstDay] = React.useState(new Date(now.setDate(now.getDate() - now.getDay()+1)))
  const [lastDay, setLastDay] = React.useState(new Date(now.setDate(now.getDate() - now.getDay()+7)))
  const [sevenDays, setSevenDays] = React.useState([]);
  const { recipeList } = props;
  const [menuList, setMenuList] = React.useState(getMenuList());
  

  React.useEffect(() => {
    get7Days();
  },[firstDay, lastDay, menuList]);

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
      <h1>{`${fd.month} (${fd.date} - ${ld.date}) / ${ld.year}`}</h1>
      )
    }

    return (
      <h1>{`${fd.month} ${fd.date} - ${ld.month} ${ld.date} / ${ld.year}`}</h1>
    )
  }

  const get7Days = () => {
    var curr = new Date();
    const sd = []
    for(let i = 1; i <= days.length; i++){
      const date = new Date(curr.setDate(curr.getDate() - curr.getDay()+i));
      const rd = {
        month: months[date.getMonth()],
        day: days[date.getDay()],
        date: date.getDate()
      }
      sd.push(rd);
    }
    setSevenDays(sd)
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
    if(index > 0){
      const ml = {...menuList}
      ml[index] = newMeal;
      setMenuList([]);
      console.log(menuList);
    } 
    // else {
    //   setMenuList({...menuList, newMeal})
    // }
  }

  return (
    <Container style={{marginTop:'100px'}}>
        <center>{dateRange()}</center>
        <VerticalTimeline >
          {
            sevenDays.map((d, i) => {
              const n = new Date();
              const check = (days[n.getDay()] === d.day ? true : false);
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
                  <VerticalTimelineElement
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