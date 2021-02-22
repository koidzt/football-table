import { Tab, Tabs } from 'react-bootstrap';
import './App.css';
import ClassTeam from './pages/ClassTeam';
import Normal from './pages/Normal';

function App() {
  return (
    <div className="App">
      <Tabs defaultActiveKey="Normal" id="uncontrolled-tab-example">
        <Tab eventKey="Normal" title="Normal">
          <Normal />
        </Tab>
        <Tab eventKey="ClassTeam" title="Class Team">
          <ClassTeam />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
