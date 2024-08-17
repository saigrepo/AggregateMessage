import {useState} from "react";

function Login() {
    const [form, setForm] = useState({
        emailId: "", userPassword: ""
    });

    const handleChange = (event) => {
        const {id, value} = event.target;
        setForm(prevState => ({
            ...prevState, [id]: value
        }))
    }
    const handleSubmit = () => {
        console.log(form.emailId + "" + form.userPassword);
    }
    return (
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
    )
}

export default Login