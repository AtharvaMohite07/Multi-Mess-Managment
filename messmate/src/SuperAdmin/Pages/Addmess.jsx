import React from "react";
import SignupPhoto from "../../Svg/Signup.png";
import { useEffect, useRef, useState } from "react";
import axios from "../../Api/axios";
import Alert from "../../Components/Alert";

const Email_Checker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const Mobile_Cheker = /^[6-9]\d{9}$/gi;

const Addmess = () => {
  const [validEmail, setValidEmail] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState({
    mode: false,
    message: "",
    type: "bg-[red]",
  });
  const [messName, setMessName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [ContactPersonName, setContactPersonName] = useState("");
  const [ContactPersonPhoneNumber, setContactPersonPhoneNumber] = useState("");
  const [ContactPersonEmail, setContactPersonEmail] = useState("");
  const [menuType, setmenuType] = useState("Veg"); // Default value for menuType
  const [timings, setTimings] = useState({});
  const [isActive, setIsActive] = useState(true);

  // validation in all fields
  useEffect(() => {
    setValidEmail(Email_Checker.test(ContactPersonEmail));
  }, [ContactPersonEmail]);

  useEffect(() => {
    setValidEmail(Mobile_Cheker.test(ContactPersonPhoneNumber));
  }, [ContactPersonPhoneNumber]);


  // handling submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const e1 = Email_Checker.test(ContactPersonEmail);
    if (!e1) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
          "/messes/createmess", // Match the route path in messRoutes.js
          JSON.stringify({
            messName,
            location,
            capacity,
            ContactPersonName,
            ContactPersonPhoneNumber,
            ContactPersonEmail,
            menuType,
            timings,
            isActive
          }),
          {
            headers: {"Content-Type": "application/json"},
            withCredentials: true,
          }
      );

      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response))
      setSuccess(true);

      //clear state and controlled inputs
      setMessName("");
      setLocation("");
      setCapacity("");
      setContactPersonEmail("");
      setContactPersonName("");
      setmenuType("");
      setTimings("")
      setIsActive("");
      setAlert({
        mode: true,
        message: "Mess registered successfully",
        type: "bg-[green]",
      });
    } catch (err) {
      if (!err?.response) {
        setAlert({
          mode: true,
          message: "No Server Response",
          type: "bg-[red]",
        });
      } else if (err.response?.status === 409) {
        setAlert({
          mode: true,
          message: "Mess Name Taken",
          type: "bg-[red]",
        });
      } else {
        setAlert({
          mode: true,
          message: "Registration failed",
          type: "bg-[red]",
        });
      }
    }
  };

  return (
      <>
        <section className="text-gray-600 body-font">
          {alert.mode && <Alert alert={alert} setAlert={setAlert}/>}
          <div className="container mx-auto flex flex-wrap items-center justify-between">
            <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 flex-[5] pr-4">
              <img
                  src={SignupPhoto}
                  aria-hidden
                  className="min-h-fit"
                  alt="Photo coming please wait"
              />
            </div>
            <div
                className="lg:w-2/6 md:w-1/2 p-9 ml-8 bg-gray-100 rounded-lg flex flex-[5] flex-col md:ml-auto w-full mt-10 md:mt-0">
              <h2 className="text-gray-900 text-3xl text-center font-medium title-font ">
                Add Mess
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="relative mb-4">
                  <label
                      htmlFor="mess-name"
                      className="leading-7 text-sm text-gray-600"
                  >
                    Mess Name
                  </label>
                  <input
                      type="text"
                      id="mess-name"
                      name="messName"
                      value={messName}
                      onChange={(e) => setMessName(e.target.value)}
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                      htmlFor="mess-name"
                      className="leading-7 text-sm text-gray-600"
                  >
                    Contact Name
                  </label>
                  <input
                      type="text"
                      id="mess-name"
                      name="ContactPersonName"
                      value={ContactPersonName}
                      onChange={(e) => setContactPersonName(e.target.value)}
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
                      name="ContactPersonEmail"
                      value={ContactPersonEmail}
                      onChange={(e) => setContactPersonEmail(e.target.value)}
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                      htmlFor="contact"
                      className="leading-7 text-sm text-gray-600"
                  >
                    Contact Number
                  </label>
                  <input
                      type="tel"
                      id="contact"
                      name="ContactPersonPhoneNumber"
                      value={ContactPersonPhoneNumber}
                      onChange={(e) => setContactPersonPhoneNumber(e.target.value)}
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
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                      htmlFor="menu-type"
                      className="leading-7 text-sm text-gray-600"
                  >
                    Menu Type
                  </label>
                  <select
                      id="menuType"
                      value={menuType}
                      onChange={(e) => setmenuType(e.target.value)}
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div className="relative mb-4">
                  <label
                      htmlFor="breakfast"
                      className="leading-7 text-sm text-gray-600"
                  >
                    Breakfast Timing
                  </label>
                  <input
                      type="text"
                      id="breakfast"
                      value={timings.breakfast || ""}
                      onChange={(e) => setTimings({...timings, breakfast: e.target.value})}
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                      htmlFor="lunch"
                      className="leading-7 text-sm text-gray-600"
                  >
                    Lunch Timing
                  </label>
                  <input
                      type="text"
                      id="lunch"
                      value={timings.lunch || ""}
                      onChange={(e) => setTimings({...timings, lunch: e.target.value})}
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                      htmlFor="dinner"
                      className="leading-7 text-sm text-gray-600"
                  >
                    Dinner Timing
                  </label>
                  <input
                      type="text"
                      id="dinner"
                      value={timings.dinner || ""}
                      onChange={(e) => setTimings({...timings, dinner: e.target.value})}
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
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                      htmlFor="is-active"
                      className="leading-7 text-sm text-gray-600"
                  >
                    Is Active
                  </label>
                  <select
                      id="is-active"
                      name="isActive"
                      value={isActive}
                      onChange={(e) => setIsActive(e.target.value)}
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <button
                    className="text-white bg-indigo-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-900 rounded text-lg"
                    type="submit" // Changed type to "submit" for the form submission
                >
                  Create Mess
                </button>
              </form>
            </div>
          </div>
        </section>
      </>
  );
}
export default Addmess;
