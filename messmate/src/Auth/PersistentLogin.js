import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "./useAuth";
import useRefresh from "./useRefresh"
import refreshSuperAdmin from "./useRefreshSuperAdmin";

const PersistentLogin = () => {
    const refresh = useRefresh();
    const {auth} = useAuth();
    const [refreshing , isRefreshing] = useState(true)

    useEffect(() => {
        const verifyCookie = async () => {
            try {
                if (auth.role === 3) {
                    // If the user is a superadmin, use refreshSuperAdmin
                    await refreshSuperAdmin();}
                else {
                    // Otherwise, use the regular refresh function
                    await refresh();
                }

            } catch (error) {
                console.log(error);
            }
            finally
            {
                isRefreshing(false)
            }
        }

        auth.accessToke?isRefreshing(false) : verifyCookie()
    } , []);

    return (
        refreshing ? <p>Loading ....</p> : <Outlet />
    )
}

export default PersistentLogin