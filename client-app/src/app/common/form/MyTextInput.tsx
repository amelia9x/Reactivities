import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
  label?: string;
  name: string;
  placeholder: string; 
  type?: string;
}

export default function MyTextInput(props: Props) {
  const [field, meta] = useField(props.name);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <input {...field} {...props}/>
      {meta.touched && !!meta.error ? <Label basic color="red">{meta.error}</Label> : null}
    </Form.Field>
  )
}