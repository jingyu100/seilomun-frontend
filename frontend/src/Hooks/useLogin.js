import { useContext } from "react";
import LoginContext from "../Context/LoginContext";

const useLogin = () => useContext(LoginContext);

export default useLogin;
