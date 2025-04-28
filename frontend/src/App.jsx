import reactLogo from "./assets/react.svg";
import djangoLogo from "./assets/django.svg";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <a href="https://django.dev" target="_blank">
          <img src={djangoLogo} className="logo" alt="django logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Django + React</h1>
    </>
  );
}

export default App;
