import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./routes";

import GlobalStyle from "./styles/global";

const App = (): JSX.Element => {
  return (
    <Router>
      <GlobalStyle />
      <Routes />
    </Router>
  );
};

export default App;
