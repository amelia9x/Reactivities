import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import * as Yup from 'yup'
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import {v4 as uuid} from 'uuid';

export default observer (function ActivityForm() {
  const {activityStore} = useStore()
  const {createActivity, editActivity, loading, initialLoading, loadActivity} = activityStore

  const {id} = useParams()
  const navigate = useNavigate()

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    date: null,
    description: "",
    category: "",
    city: "",
    venue: "",
  })

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required!"),
    description: Yup.string().required(),
    category: Yup.string().required(),
    date: Yup.string().required(),
    city: Yup.string().required(),
    venue: Yup.string().required(),
  })

  useEffect(() => {
    if(id) loadActivity(id).then((activity) => setActivity(activity!))
  }, [id, loadActivity])

  const handleFormSubmit = (activity: Activity) => {
    if(!activity.id) {
      activity.id = uuid()
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    } else {
      editActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    }
  }

  if(initialLoading) return <LoadingComponent content="Loading activity ..."/>

  return (
    <Segment clearing>
      <Header content="Activity Details" color="teal" sub/>
      <Formik 
          validationSchema={validationSchema}
          enableReinitialize 
          initialValues={activity} 
          onSubmit={(values) => handleFormSubmit(values)}>
        {({handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput placeholder="Title" name="title"/>
            <MyTextArea rows={3} placeholder='Description' name="description"/>
            <MySelectInput options={categoryOptions} placeholder='Category' name="category"/>
            <MyDateInput 
              placeholderText='Date' 
              name="date"
              showTimeSelect
              timeCaption="time"  
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" color="teal" sub/>
            <MyTextInput placeholder='City' name="city"/>
            <MyTextInput placeholder='Venue' name="venue"/>
            <Button 
              disabled={isSubmitting || !dirty || !isValid}
              loading={loading} 
              floated="right" 
              positive type="submit" 
              content="Submit"/>
            <Button floated="right" type="submit" content="Cancel" as={Link} to="/activities"/>
          </Form>
        )}
      </Formik>
    </Segment>
  )
})