import { StrictMode } from 'react'
import ReactDOM from "react-dom/client"; 
import "./styles/app.scss";
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
