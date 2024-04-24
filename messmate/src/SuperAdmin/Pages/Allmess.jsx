import React, { useEffect, useState } from "react";
import axios from "../../Api/axios";
import EditMessModal from "./EditMess";

function AllMess() {
  const [EditMessModal, setEditMessModal] = useState(false);
  const [messId, setMessId] = useState(null);
  const [messName, setMessName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [menuType, setMenuType] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [ContactPersonEmail, setContactPersonEmail] = useState("");
  const [ContactPersonPhoneNumber, setContactPersonPhoneNumber] = useState("");
  const [messList, setMessList] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const row = 5;
  const totalpages = Math.ceil(messList.length / row);
  const [startingIndex, setStartingIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/messes/getmess", {
          withCredentials: true,
        });
        setMessList(response.data);
      } catch (error) {
        console.error("Error fetching mess data: ", error);
      }
    };

    fetchData();
  }, [EditMessModal]);

const handleDelete = async (email) => {
        try {
            const response = await axios.delete(`/messes/delete/${email}`, {
                withCredentials: true,
            });
            console.log(response);
            // Refresh mess list or handle success message
        } catch (error) {
            console.error("Deletion failed: ", error);
        }
    };
    const handleEdit = (email) => {
        // Set the email to the state to be used in the edit modal
        setContactPersonEmail(email);
        // Open the edit modal
        setEditMessModal(true);
    };

  const content = messList
      .filter((mess) => {
        return (
            mess.messName.toLowerCase().includes(search) ||
            mess.location.toLowerCase().includes(search)
        );
      })
      .slice(startingIndex, startingIndex + row)
      .map((mess) => {
        return (
            <tr key={mess.messId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="w-4 p-4">
                <div className="flex items-center justify-center text-black">
                  {mess.messId}
                </div>
              </td>
              <td className="text-black px-6 py-4">
                <div className="flex items-center justify-center text-black">
                  {mess.messName}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center  text-black">
                  {mess.location}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center text-black">
                  {mess.capacity}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center text-black">
                  {mess.menuType}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center text-black">
                  {mess.isActive ? "Active" : "Inactive"}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center text-black">
                  {mess.contactPerson.email}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center text-black">
                  {mess.contactPerson.phoneNumber}
                </div>
              </td>
              <td className="px-6 py-4">
                <button
                    type="button"
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-[0.5rem] text-center mr-2 mb-2"
                    onClick={() => handleEdit(mess.contactPerson.email)}
                >
                  Edit
                </button>
                <button
                    type="button"
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-3 py-[0.5rem] text-center mr-2 mb-2"
                    onClick={() => handleDelete(mess.contactPerson.email)}
                >
                  Delete
                </button>
              </td>
            </tr>
        );
      });

  const pagesArray = Array(totalpages)
      .fill()
      .map((index, i) => {
        return (
            <button
                key={i}
                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                onClick={() => {
                  setPage(i);
                  setStartingIndex(i * row);
                }}
            >
              {i}
            </button>
        );
      });

  return (
      <div className="relative w-[99%] overflow-x-auto shadow-xl sm:rounded-lg">
        <div className="flex items-center justify-end pb-4 bg-white dark:bg-gray-900">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-2 right-0 px-1  flex items-center pl-3 pointer-events-none">
              <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                />
              </svg>
            </div>
            <input
                type="text"
                id="table-search-mess"
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for mess"
                onChange={(e) => {
                  setSearch(e.target.value.toLowerCase());
                }}
                value={search}
            />
          </div>
        </div>

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-dark dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 w-[10rem] text-center">
              Mess ID
            </th>
            <th scope="col" className="px-6 py-3 w-[10rem] text-center">
              Name
            </th>
            <th scope="col" className="px-6 py-3 w-[10rem] text-center">
              Location
            </th>
            <th scope="col" className="px-6 py-3 w-[10rem] text-center">
              Capacity
            </th>
            <th scope="col" className="px-6 py-3 w-[10rem] text-center">
              Menu Type
            </th>
            <th scope="col" className="px-6 py-3 w-[10rem] text-center">
              Active Status
            </th>
            <th scope="col" className="px-6 py-3 w-[10rem] text-center">
              Contact Person Email
            </th>
            <th scope="col" className="px-6 py-3 w-[10rem] text-center">
              Phone Number
            </th>
            <th scope="col" className="px-6 py-3 w-[10rem] text-center">
              Operation
            </th>
          </tr>
          </thead>

          <tbody>{content}</tbody>
        </table>

        <div className="flex mt-2 mb-2 ">
          <nav
              className="isolate m-auto min-h-[40px]  inline-flex mb-5 flex-space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
          >
            <button
                onClick={() => setPage(page - 1)}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
              >
                <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                />
              </svg>
            </button>
            {pagesArray}
            <button
                onClick={() => setPage(page + 1)}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
              >
                <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
  );
}

export default AllMess;
