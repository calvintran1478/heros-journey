import axios from "axios";

export async function getToken(): Promise<string> {
    try {
        const response = await axios.get("http://localhost:8080/api/v1/users/token", {
            withCredentials: true
        });
        return response.data.token;
    } catch {
        return "";
    }
}