import React, { useEffect, useState } from "react";
import axios from "../../Api/axios";
import Alert from "../../Components/Alert";
import closeBtnpic from "../../Svg/close.svg";

const Email_Checker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const Mobile_Cheker = /^[6-9]\d{9}$/gi;

function EditMess(props) {
  const [alert, setAlert] = useState({
    mode: false,
    message: "",
    type: "bg-[red]",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [menuType, setMenuType] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch mess data for editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/messes/getmessbyemail/${props.email}`, {
          withCredentials: true,
        });
        const data = response.data;
        setName(data.name);
        setEmail(data.email); // Assuming email is available in the response data
        setLocation(data.location);
        setCapacity(data.capacity);
        setMenuType(data.menuType);
        setIsActive(data.isActive);
      } catch (error) {
        console.error("Error fetching mess data: ", error);
      }
    };

    fetchData();
  }, [props.email]);

  // handling submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !location || !capacity || !menuType || !email) {
      setErrMsg("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.patch(
          `/messes/update/${email}`,
          JSON.stringify({ name, location, capacity, menuType, isActive }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
      );

      console.log(JSON.stringify(response?.data));
      setSuccess(true);

      // Clear state and controlled inputs
      props.setEditModal(false);
    } catch (error) {
      setAlert({
        mode: true,
        message: error.message,
        type: "bg-[red]",
      });
    }
  };

  return (
      <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
      >
        <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => props.setEditModal(false)}
        />

        <div className="flex fixed left-[35%] min-w-[30%] max-w-[31%] transform overflow-hidden p-7 bg-gray-100 rounded-lg flex-col md:mt-0">
          <div className="flex">
            <h2 className="grow h-14 text-gray-900 text-3xl text-center font-medium title-font mb-2">
              Edit Mess
            </h2>
            <div class="flex-none ">
              <img
                  src={closeBtnpic}
                  alt=""
                  className="cursor-pointer min-h-[35px] min-w-[35px] mt-1"
                  onClick={() => props.setEditModal(false)}
              />
            </div>
          </div>
          {alert.mode ? <Alert alert={alert} setAlert={setAlert} /> : ""}
          <form>
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Mess Name
              </label>
              <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                  htmlFor="location"
                  className="leading-7 text-sm text-gray-600"
              >
                Location
              </label>
              <input
                  type="text"
                  id="location"
                  name="location"
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                  htmlFor="capacity"
                  className="leading-7 text-sm text-gray-600"
              >
                Capacity
              </label>
              <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  onChange={(e) => setCapacity(e.target.value)}
                  value={capacity}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                  htmlFor="menuType"
                  className="leading-7 text-sm text-gray-600"
              >
                Menu Type
              </label>
              <input
                  type="text"
                  id="menuType"
                  name="menuType"
                  onChange={(e) => setMenuType(e.target.value)}
                  value={menuType}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                  htmlFor="email"
                  className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                  htmlFor="isActive"
                  className="leading-7 text-sm text-gray-600"
              >
                Active Status
              </label>
              <select
                  id="isActive"
                  name="isActive"
                  onChange={(e) => setIsActive(e.target.value)}
                  value={isActive}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <button
                onClick={handleUpdate}
                className="text-white bg-indigo-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Update Mess
            </button>
          </form>
        </div>
      </div>
  );
}

export default EditMess;
