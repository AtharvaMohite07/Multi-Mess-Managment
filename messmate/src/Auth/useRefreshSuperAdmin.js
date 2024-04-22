import { useState } from 'react'; // Import useState from React
import axiosPrivate from '../Api/axios.js'

const useRefreshSuperAdmin = (setAuth) => { // Pass setAuth as a parameter
    const [loading, setLoading] = useState(false);

    const refreshSuperAdmin = async () => {
        setLoading(true);
        try {
            // Refresh the superadmin token on the backend
            const response = await axiosPrivate.get("/auth/refreshsuperadmin", {
                withCredentials: true
            });

            // Update the auth context with the new superadmin token
            setAuth(prev => ({
                ...prev,
                "userId": response.data.userId,
                "name": response.data.name,
                "email": response.data.email,
                "mobileno": response.data.mobileno,
                "role": response.data.role,
                "accessToken": response.data.accessToken
            }));
        } catch (error) {
            console.error("Error refreshing superadmin token:", error);
        } finally {
            setLoading(false);
        }
    };

    return { refreshSuperAdmin, loading };
};

export default useRefreshSuperAdmin;
