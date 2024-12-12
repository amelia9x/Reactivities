import { ChangeEvent, useEffect, useState } from "react";
import { Button, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from 'uuid';
import { Formik, Form, Field } from "formik";

export default observer (function ActivityForm() {
  const {activityStore} = useStore()
  const {createActivity, editActivity, loading, initialLoading, loadActivity} = activityStore

  const {id} = useParams()
  const navigate = useNavigate()

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    date: "",
    description: "",
    category: "",
    city: "",
    venue: "",
  })

  useEffect(() => {
    if(id) loadActivity(id).then((activity) => setActivity(activity!))
  }, [id, loadActivity])

  // const handleSubmit = () => {
  //   if(!activity.id) {
  //     activity.id = uuid()
  //     createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
  //   } else {
  //     editActivity(activity).then(() => navigate(`/activities/${activity.id}`))
  //   }
  // }

  // const handleInputChange = (event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const {name, value} = event.target
  //   setActivity({...activity, [name]: value})
  // }

  if(initialLoading) return <LoadingComponent content="Loading activity ..."/>

  return (
    <Segment clearing>
      <Formik enableReinitialize initialValues={activity} onSubmit={(values) => console.log(values)}>
        {({handleSubmit}) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <Field placeholder='Title' name="title"/>
            <Field placeholder='Description' name="description"/>
            <Field placeholder='Category' name="category"/>
            <Field type="date" placeholder='Date' name="date"/>
            <Field placeholder='City' name="city"/>
            <Field placeholder='Venue' name="venue"/>
            <Button loading={loading} floated="right" positive type="submit" content="Submit"/>
            <Button floated="right" type="submit" content="Cancel" as={Link} to="/activities"/>
          </Form>
        )}
      </Formik>
    </Segment>
  )
})