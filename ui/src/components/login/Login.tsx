import {useState} from "react";
import './Login.css';
import axios from "axios";

function Login() {
    const [form, setForm] = useState({
        emailId: "", userPassword: ""
    });

    const handleChange = (event: any) => {
        const {id, value} = event.target;
        setForm(prevState => ({
            ...prevState, [id]: value
        }))
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        let emailId = form.emailId;
        let userPassword = form.userPassword;
        try {
            const loginResponse = await axios.post("http://localhost:6910/api/v1/auth/login",
                {"emailId": emailId, "password": userPassword}, {withCredentials: true});
            const token = loginResponse.data.token;
            console.log(token);
        }
        catch (e) {
            console.log(e.message);
        }

    }
    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input type='text'
                       id={'emailId'}
                       value={form.emailId}
                       onChange={handleChange}
                       placeholder={'Enter Email ID'}
                       required/>
                <input type='password'
                       id={'userPassword'}
                       value={form.userPassword}
                       onChange={handleChange}
                       placeholder={'Enter Password'}
                       required/>
                <button type={'submit'}>Login</button>
            </form>
        </div>
    )
}

export default Login