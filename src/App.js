// import Login from "./components/Login";
// // import Register from "./components/Register";
// import ipConfig from "./ipConfig.json";


// export const config = {
//   endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
// };

// function App() {
//   return (
//     <div className="App">
//           <Login />
//     </div>
//   );
// }


// export default App;
import React from "react";
import Register from "./components/Register";
import Product from "./components/Products";
import Login from "./components/Login";
import { ThemeProvider } from "@mui/material/styles";  // Import ThemeProvider
// import Register from "./components/Register"; // Commented as not needed yet
import theme from "./theme";  // Import the theme
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";


export const config = {
  endpoint: `https://qkart_frontend.onrender.com/api/v1`,
};

function App() {
  return (
    <ThemeProvider theme={theme}>  {/* Wrap components inside ThemeProvider */}
      <React.StrictMode>
      <Router>  {/* Set up Router */}
          <div className="App">
            <Switch>  {/* Switch allows only one Route to render at a time */}
              <Route exact path="/" component={Product} />  {/* Route for the homepage */}
              <Route path="/register" component={Register} />  {/* Route for registration page */}
              <Route path="/login" component={Login} />  {/* Route for login page */}
              <Route path="/checkout" component={Checkout} />  {/* Route for checkout page */}
              <Route path="/thanks" component={Thanks} />  {/* Route for Thanks page */}
            </Switch>
          </div>
        </Router>
      </React.StrictMode>
    </ThemeProvider>
  );
}

export default App;
