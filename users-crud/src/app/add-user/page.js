"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createUser } from "@/store/userSlice";
import { useRouter } from "next/navigation";

export default function AddUser() {
  const dispatch = useDispatch();
  const router = useRouter();

  const initialValues = {
    name: "",
    email: "",
    company: "",
    city: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    company: Yup.string().required("Company is required"),
    city: Yup.string().required("City is required"),
  });

  const handleSubmit = (values) => {
    const userData = {
      id: Date.now(), // temporary unique ID (replace with backend ID if available)
      name: values.name,
      email: values.email,
      company: { name: values.company },
      address: { city: values.city },
    };

    dispatch(createUser(userData));
    router.push("/");
  };

  return (
    <div className="container mt-5">
      <h2>Add User</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className="mb-3">
              <label>Name</label>
              <Field name="name" type="text" className="form-control" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label>Company</label>
              <Field name="company" type="text" className="form-control" />
              <ErrorMessage
                name="company"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label>City</label>
              <Field name="city" type="text" className="form-control" />
              <ErrorMessage
                name="city"
                component="div"
                className="text-danger"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save User
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
