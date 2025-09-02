"use client";

import { deleteUser, fetchUsers } from "@/store/userSlice";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import debounce from "lodash/debounce";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data: users, loading } = useSelector((state) => state.users);
  const [showList, setShowList] = useState(false);

  const [cityFilter, setCityFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const [internalSearch, setInternalSearch] = useState("");
  const debouncedSearchHandler = useMemo(
    () =>
      debounce((value) => {
        setInternalSearch(value.trim().toLowerCase());
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSearchHandler(searchTerm);
    return () => {
      debouncedSearchHandler.cancel();
    };
  }, [searchTerm, debouncedSearchHandler]);

  const counts = {
    total: users.length,
  };

  const cities = [...new Set(users.map((u) => u.address?.city).filter(Boolean))];
  const companies = [...new Set(users.map((u) => u.company?.name).filter(Boolean))];

  const filteredUsers = users.filter((user) => {
    if (cityFilter && user.address?.city !== cityFilter) return false;
    if (companyFilter && user.company?.name !== companyFilter) return false;

    if (internalSearch) {
      const name = user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const company = user.company?.name?.toLowerCase() || "";
      return (
        name.includes(internalSearch) ||
        email.includes(internalSearch) ||
        company.includes(internalSearch)
      );
    }

    return true;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [cityFilter, companyFilter, internalSearch]);

  if (loading) {
    return <Loader fullscreen text="Fetching users..." />;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Users Dashboard</h1>

      <div className="d-flex gap-2 mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowList(!showList)}
        >
          {showList ? "Hide Users List" : "View Users List"}
        </button>

        <Link href="/add-user" className="btn btn-success">
          ➕ Add New User
        </Link>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div className="card text-bg-primary mb-3">
            <div className="card-body">
              <h5>Total Users</h5>
              <p className="fs-3">{counts.total}</p>
            </div>
          </div>
        </div>
      </div>

      {showList && (
        <>
          <div className="mb-3 d-flex gap-3 flex-wrap">
            <select
              className="form-select w-auto"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              className="form-select w-auto"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="form-control w-auto"
              placeholder="Search by name, email, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="form-select w-auto"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num} / page
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <h3>Users List</h3>
            <p>
              Showing <b>{totalItems === 0 ? 0 : startIndex + 1}</b>–
              <b>{Math.min(endIndex, totalItems)}</b> of <b>{totalItems}</b> users
            </p>

            <table className="table table-bordered mt-2">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.company?.name}</td>
                    <td>{user.address?.city || "-"}</td>
                    <td className="d-flex gap-2">
                      <Link
                        href={`/users/${user.id}`}
                        className="btn btn-sm btn-info"
                        title="View Details"
                      >
                        👁 View
                      </Link>
                      <Link
                        href={`/edit-user/${user.id}`}
                        className="btn btn-sm btn-warning"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <li
                      key={num}
                      className={`page-item ${currentPage === num ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </>
      )}

      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Delete User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete{" "}
                  <b>{selectedUser?.name}</b>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    if (selectedUser) {
                      dispatch(deleteUser(selectedUser.id));
                      setShowDeleteModal(false);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
