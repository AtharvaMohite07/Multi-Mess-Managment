import React, { useEffect, useState } from "react";
import useAuth from "../../Auth/useAuth";
import axios from "../../Api/axios";

const ProfileScanner = () => {
  const [plan, setPlan] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const getCurrentPlan = async () => {
      const userId = auth.userId;

      try {
        const planResponse = await axios.get(
            `/userplan/getusertodayplan/${userId}`,
            {
              withCredentials: true,
            }
        );

        const isTodayBreakfast = planResponse.data[0].isavailable[0].breakfast;
        const isTodayLunch = planResponse.data[0].isavailable[0].lunch;
        const isTodayDinner = planResponse.data[0].isavailable[0].dinner;

        let planDataObject = null;
        if (planResponse.data.length !== 0) {
          planDataObject = {
            planId: planResponse.data[0].planId,
            fee: planResponse.data[0].fees,
            fee_status: planResponse.data[0].fee_status,
            isTodayBreakfast,
            isTodayLunch,
            isTodayDinner,
          };
        } else {
          planDataObject = {
            planId: "You have no plan for today",
            fee: "",
            fee_status: "",
            isTodayBreakfast: "",
            isTodayLunch: "",
            isTodayDinner: "",
          };
        }

        setPlan(planDataObject);
      } catch (error) {
        console.log(error);
      }
    };
    getCurrentPlan();
  }, [auth.userId]);

  return (
      <div className="profile-summary m-auto flex items-center justify-center h-[40rem]">
        <div className="summary-content flex-[1] h-[30rem] flex flex-col items-center justify-center">
          {plan ? (
              <>
                <h1 className="text-black text-center text-4xl font-semibold">
                  Today's Plan Summary
                </h1>
                <p>Plan ID: {plan.planId}</p>
                <p>Fee: {plan.fee}</p>
                {/*<p>Fee Status: {plan.fee_status}</p>*/}
                <p>Breakfast: {plan.isTodayBreakfast ? "Available" : "Not Available"}</p>
                <p>Lunch: {plan.isTodayLunch ? "Available" : "Not Available"}</p>
                <p>Dinner: {plan.isTodayDinner ? "Available" : "Not Available"}</p>
              </>
          ) : (
              <h1 className="text-black text-center text-4xl font-semibold">
                Loading...
              </h1>
          )}
        </div>
      </div>
  );
};

export default ProfileScanner;