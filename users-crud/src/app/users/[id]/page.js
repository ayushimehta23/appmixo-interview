"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchUserById, fetchUsers } from "@/store/userSlice";
import Loader from "@/components/Loader";

export default function ViewEvent() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: users, loading } = useSelector((state) => state.users);

  const [user, setEvent] = useState(null);

  useEffect(() => {
      dispatch(fetchUserById());
  }, [dispatch]);

  useEffect(() => {
    const found = users.find((e) => String(e.id) === String(id));
    if (found) setEvent(found);
  }, [users, id]);

  if (loading) return <Loader fullscreen text="Loading user details..." />;
  if (!user) return <p className="p-4 text-danger">User not found.</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          <div className="col-md-7">
            <div className="card-body">
              <h5 className="mt-4">User Info</h5>
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item">
                  <strong>Name:</strong> {user.name || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {user.email || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Company:</strong> {user.company?.name || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>City:</strong> {user.address?.city || "N/A"}
                </li>
              </ul>
              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={() => router.push(`/edit-user/${user.id}`)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => router.push("/dashboard")}
                >
                  ⬅ Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
