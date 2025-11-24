import "./App.css";

import { Button } from "react-bootstrap";
import Grid from "./components/grid";
//import axios from "axios";

//const vehicles = await axios.get("/api/vehicles");

function App() {
    return (
        <>
            <Grid />
            <div>
                <Button variant="primary">React Bootstrap Button</Button>
            </div>
            <div>
                <Button variant="success">React Bootstrap Button</Button>
            </div>
        </>
    );
}

export default App;
