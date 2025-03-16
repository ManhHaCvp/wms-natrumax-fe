import AuthProvider from "./providers/authProvider";
import Routes from "./routes";
import {Toaster} from "react-hot-toast";

function App() {
    return (
        <AuthProvider>
            <Toaster/>
            <Routes/>
        </AuthProvider>
    );
}

export default App;