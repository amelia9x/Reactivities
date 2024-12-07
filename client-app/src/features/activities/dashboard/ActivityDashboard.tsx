import React from "react";
import { Grid, List } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

interface Props {
  activities: Activity[]
  deleteActivity: (id: string) => void
}

export default observer (function ActivityDashboard({activities, deleteActivity}: Props) {
  const { activityStore } = useStore()
  const {selectedActivity, editMode} = activityStore 

  return (
    <Grid style={{marginRight: '20px'}}>
      <Grid.Column width='10'>
        <ActivityList activities={activities} deleteActivity={deleteActivity}/>
      </Grid.Column>
      <Grid.Column width='6'>
        {selectedActivity && !editMode && <ActivityDetails />}
        {editMode && <ActivityForm/>}
      </Grid.Column>
    </Grid>
  )
})