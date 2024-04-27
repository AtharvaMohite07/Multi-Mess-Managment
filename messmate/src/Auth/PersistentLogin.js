import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "./useAuth";
import useRefresh from "./useRefresh";
import useRefreshSuperAdmin from "./useRefreshSuperAdmin";

const PersistentLogin = () => {
    const refresh = useRefresh();
    const refreshSuperAdmin = useRefreshSuperAdmin();
    const { auth } = useAuth();
    const [refreshing, setRefreshing] = useState(true);

    useEffect(() => {
        const verifyCookie = async () => {
            try {
                if (auth.role === 3) {
                    await refreshSuperAdmin();
                } else {
                    await refresh();
                }
            } catch (error) {
                console.log(error);
            } finally {
                setRefreshing(false);
            }
        };

        if (!auth.accessToken  || auth.role === undefined) {
            verifyCookie();
        } else {
            setRefreshing(false);
        }
    }, [auth.accessToken, auth.role, refresh,refreshSuperAdmin]); // Add dependencies to the array

    return (
        refreshing ? <p>Loading ....</p> : <Outlet />
    );
};

export default PersistentLogin;