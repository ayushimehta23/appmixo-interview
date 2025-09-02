"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { fetchUserById, updateUser } from "@/store/userSlice";
import Loader from "@/components/Loader";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: users, loading } = useSelector((state) => state.users);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const existing = users.find((u) => String(u.id) === String(id));
    if (existing) {
      setInitialValues({
        name: existing.name || "",
        email: existing.email || "",
        company: existing.company?.name || "",
        city: existing.address?.city || "",
      });
    }
  }, [users, id]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    company: Yup.string().required("Company is required"),
    city: Yup.string().required("City is required"),
  });

  const handleSubmit = async (values) => {
    const updatedUser = {
      id,
      changes: {
        name: values.name,
        email: values.email,
        company: { name: values.company },
        address: { city: values.city },
      },
    };
  
    await dispatch(updateUser(updatedUser));
    router.push("/");
  };

  if (loading || !initialValues) {
    return <Loader fullscreen text="Loading user details..." />;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Edit User</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {() => (
          <Form>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <Field name="name" className="form-control" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <Field type="email" name="email" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Company</label>
              <Field name="company" className="form-control" />
              <ErrorMessage
                name="company"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">City</label>
              <Field name="city" className="form-control" />
              <ErrorMessage
                name="city"
                component="div"
                className="text-danger"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
