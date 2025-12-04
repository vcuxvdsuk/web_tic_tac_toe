import "./App.css";

import Grid from "./components/grid";
import JoinButton from "./components/join_btn";

function App() {
    return (
        <>
            <Grid />
            <JoinButton onJoined={() => {}} />
        </>
    );
}

export default App;
