import React from "react";
import { Grid, List } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
  activities: Activity[]
  selectedActivity: Activity | undefined
  selectActivity: (id: string) => void
  cancelSelectActivity: () => void
  openForm: (id?: string) => void
  deleteActivity: (id: string) => void
  closeForm: () => void
  editMode: boolean
  createOrEdit: (activity: Activity) => void
  submitting: boolean
}

export default function ActivityDashboard({activities, selectedActivity, selectActivity, cancelSelectActivity, openForm, closeForm, editMode, deleteActivity, createOrEdit, submitting}: Props) {
  return (
    <Grid style={{marginRight: '20px'}}>
      <Grid.Column width='10'>
        <ActivityList activities={activities} selectActivity={selectActivity} deleteActivity={deleteActivity} submitting={submitting}/>
      </Grid.Column>
      <Grid.Column width='6'>
        {selectedActivity && !editMode && <ActivityDetails openForm={openForm} activity={selectedActivity} cancelSelectActivity={cancelSelectActivity} />}
        {editMode && <ActivityForm closeForm={closeForm} selectedActivity={selectedActivity} createOrEdit={createOrEdit} submitting={submitting}/>}
      </Grid.Column>
    </Grid>
  )
}