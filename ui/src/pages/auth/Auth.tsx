import {useState} from "react";
import {Tabs, TabsContent} from "@radix-ui/react-tabs";
import {TabsList, TabsTrigger} from "../../components/ui/tabs.tsx";
import {Input} from "../../components/ui/input.tsx";
import {Button} from "../../components/ui/button.tsx";
import {loginForm, signupForm} from "../../models/model-types.ts";
import {toast} from "sonner";
import apiClient from "../../lib/api-client.ts";
import {LOGIN_ROUTE, SIGNUP_ROUTE} from "../../utils/Constants.ts";
import {useNavigate} from "react-router-dom";
import {useAppStore} from "../../slices";
import {Simulate} from "react-dom/test-utils";
import waiting = Simulate.waiting;

function Auth() {
    const [tabsDefault, setTabsDefault] = useState("Login")
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    const [loginForm, setLoginForm] = useState<loginForm>({
        loginEmailId: "", loginPassword: ""
    });

    const [signupForm, setSignupForm] = useState<signupForm>({
        signupEmailId: "", confirmSignupPassword: "", signupPassword: ""
    });

    const handleLoginChange = (event: any) => {
        const {id, value} = event.target;
        setLoginForm(prevState => ({
            ...prevState, [id]: value
        }))
    }

    const handleSignUpChange = (event: any) => {
        const {id, value} = event.target;
        setSignupForm(prevState => ({
            ...prevState, [id]: value
        }))
    }
    const handleLogin = async (event): Promise<void> => {
        event.preventDefault();
        if(validateLogin()) {
            try {
                const loginResponse: any = await apiClient.post(LOGIN_ROUTE,
                    {"emailId": loginForm.loginEmailId, "password": loginForm.loginPassword}, {withCredentials: true});
                const token = loginResponse.data.token;
                if (token) {
                    localStorage.setItem('jwtToken', token);
                    setUserInfo(loginResponse.data);
                }
                if(loginResponse.data.userId) {
                    if(loginResponse.data.userProfileCreated){
                        navigate('/MessageComponent');
                    }
                }
            }
            catch (e) {
                if(e.response.status == 401) {
                    toast.error("The user is not registered please sign in");
                }
                console.log(e.message);
            }
        }
    }

    const handleSignup = async (event) => {
        event.preventDefault();
        if(validateSignup()) {
            try {
                const signupResponse = await apiClient.post(SIGNUP_ROUTE,
                    {"emailId": signupForm.signupEmailId, "password": signupForm.signupPassword}, {withCredentials: true});
                if(signupResponse.data){
                    setTabsDefault("Login")
                    toast.success("Signup successful. Please login.");
                }
            }
            catch (e) {
                console.log(e.message);
            }
        }
    }

    const validateSignup = () => {
        if(!signupForm.signupEmailId.length) {
            toast.error("Please enter ur email");
            return false;
        }
        if(!signupForm.signupPassword.length || !signupForm.confirmSignupPassword.length) {
            toast.error("Please enter ur password");
            return false;
        }
        if(signupForm.signupPassword != signupForm.confirmSignupPassword) {
            toast.error("Mismatch in password and confirm password");
            return false;
        }
        return true;
    }

    const validateLogin = () => {
        if(!loginForm.loginEmailId.length) {
            toast.error("Please enter ur email");
            return false;
        }
        if(!loginForm.loginEmailId.length) {
            toast.error("Please enter ur password");
            return false;
        }
        return true;
    }


    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white shadow-2xl  w-[80vw] md:w-[90vw] lg:w-[70vw] rounded-2xl xl: grid-cols-2">
                <div className="flex flex-col gap-10 my-20 justify-items-center">
                    <div className="flex flex-col items-center justify-center gap-5 ">
                        <div className="flex items-center justify-center">
                            <h1 className="text-xl font-bold md:text-4xl">Welcome to AggregateMessenger</h1>
                        </div>
                        <p className="font-medium text-center">Enter the details</p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue={tabsDefault} value={tabsDefault} onValueChange={setTabsDefault}>
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger className="data-[state=active]: bg-transparent text-black text-opacity-60 border-b-2 w-full
                                data-[state=active]: text-black data-[state=active]: font-semibold
                                data-[state=active]:border-b-pink-400 p-3 transition-all duration-300" value="Login">Login</TabsTrigger>
                                <TabsTrigger className="data-[state=active]: bg-transparent text-black text-opacity-60 border-b-2 w-full
                                data-[state=active]: text-black data-[state=active]: font-semibold
                                data-[state=active]:border-b-pink-400 p-3 transition-all duration-300" value="Signup">Sign Up</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col mt-5" value="Login">
                                <Input className="my-2" placeholder="Email Id"
                                       type="email"
                                        value={loginForm.loginEmailId}
                                        id="loginEmailId"
                                        onChange={handleLoginChange}
                                        required/>
                                <Input  className="my-2" placeholder="password"
                                       type="password"
                                       value={loginForm.loginPassword}
                                       id="loginPassword"
                                       onChange={handleLoginChange}
                                       required/>
                                <Button className="mt -5 p-4" onClick={handleLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col" value="Signup">
                                <Input className="my-2" placeholder="Email Id"
                                       type="email"
                                       value={signupForm.signupEmailId}
                                       id="signupEmailId"
                                       onChange={handleSignUpChange}
                                       required/>
                                <Input className="my-2" placeholder="enter password"
                                       type="password"
                                       value={signupForm.signupPassword}
                                       id="signupPassword"
                                       onChange={handleSignUpChange}
                                       required/>
                                <Input className={signupForm.confirmSignupPassword != signupForm.signupPassword ? 'border-red-500  my-2' : 'my-2'} placeholder="confirm password"
                                       type="password"
                                       value={signupForm.confirmSignupPassword}
                                       id="confirmSignupPassword"
                                       onChange={handleSignUpChange}
                                       required
                                />
                                <Button className="p-4" onClick={handleSignup}>Sign Up</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Auth