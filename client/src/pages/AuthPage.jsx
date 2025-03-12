import SignUpCard from "../components/SignUpCard";
import LoginCard from "../components/LoginCard";
import { useAtom } from "jotai";
import { authScreenAtom } from "../atoms/authScreenAtom";

const AuthPage = () => {
  const [authScreenState, setAuthScreenState] = useAtom(authScreenAtom);

  return (
    <>
      {authScreenState === "login" ? (
        <LoginCard setAuthScreenState={setAuthScreenState} />
      ) : (
        <SignUpCard setAuthScreenState={setAuthScreenState}/>
      )}
    </>
  );
};

export default AuthPage;
