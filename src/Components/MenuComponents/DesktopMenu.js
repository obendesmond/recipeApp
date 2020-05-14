import React from 'react';
import Container from '@material-ui/core/Container';

import Scheduler, {Resource} from 'devextreme-react/scheduler';
import Query from "devextreme/data/query";
import notify from 'devextreme/ui/notify';

import { recipesData, data, priorityData } from '../../Libs/ApiLib';
import AppointmentTemplate from './AppointmentTemplate';

const currentDate = new Date();
const views = [{type:'timelineMonth',maxAppointmentsPerCell:1}]
const groups = ['priority'];

export default function DesktopMenu(){
  
    React.useEffect(() => {
      processData();
    },[data]);
 
    const onContentReady = (e) => {
      const currentHour = new Date().getHours() - 1;
      e.component.scrollToTime(currentHour, 30, new Date());
    }

    function getRecipesById(id) {
      return Query(recipesData).filter(['id', id]).toArray()[0];
    }

    function onAppointmentFormOpening(data) {
      let form = data.form,
        recipeInfo = getRecipesById(data.appointmentData.recipeId) || {},
        startDate = data.appointmentData.startDate;
  
      form.option('items', [{
        label: {
          text: 'Recipe'
        },
        editorType: 'dxSelectBox',
        dataField: 'recipeId',
        editorOptions: {
          items: recipesData,
          displayExpr: 'text',
          valueExpr: 'id'
        },
      },
      {
        dataField: 'startDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'datetime'
        }
      }, {
        name: 'endDate',
        dataField: 'endDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'datetime',
          readOnly: true
        }
      }
      ]);
    }

    //make appointment data contain text
    const processData = () => {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < recipesData.length; j++) {
          if(data[i].recipeId === recipesData[j].recipeId ){
            data[i].text = recipesData[j].title;
          }
        }
      }
      return data;
    }

    const showToast = (event, value, type) => {
      notify(`${event} "${value}" recipe`, type, 800);
    }

    // this function is maint to add a 'text' property to the appointment data -> 'data'
    const findRecipeText = (appData) => {
       const index = recipesData.findIndex((r) => r.recipeId === appData.recipeId);
       appData.text = recipesData[index].title;
    }

    const handleAppointmentAdd = (e) => {
      findRecipeText(e.appointmentData)
      data[data.length - 1] = e.appointmentData;
      showToast('Added', e.appointmentData.text, 'success');
    }
  
    const showUpdatedToast = (e) => {
      findRecipeText(e.appointmentData)
      showToast('Updated', e.appointmentData.text, 'info');
      console.log(e.appointmentData.text);
    }
  
    const handleAppointmentDelete = (e) => {
      findRecipeText(e.appointmentData)
      console.log(data);
      showToast('Deleted', e.appointmentData.text, 'warning');
    }

    return (
      <Container style={{marginTop:'110px', marginBottom:'70px'}}>
        <Scheduler
          dataSource={data}
          views= {views}
          defaultCurrentView="timelineMonth"
          defaultCurrentDate={currentDate}
          showCurrentTimeIndicator={true}
          shadeUntilCurrentTime={true}
          height={580}
          groups={groups}
          editing={{ allowDragging: true }}
          appointmentRender={AppointmentTemplate}
          onContentReady={onContentReady}
          onAppointmentFormOpening={onAppointmentFormOpening}
          onAppointmentAdded={handleAppointmentAdd}
          onAppointmentUpdated={showUpdatedToast}
          onAppointmentDeleted={handleAppointmentDelete}
        >
          <Resource
            fieldExpr="recipeId"
            allowMultiple={false}
            dataSource={recipesData}
            label="Recipe"
            useColorAsDefault={ true }
          />
          <Resource
            fieldExpr="priority"
            allowMultiple={false}
            dataSource={priorityData}
            label="Priority"
          />
        </Scheduler>
      </Container>
    )

}
