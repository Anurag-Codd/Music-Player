import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import { Container, Row, Col } from "react-bootstrap";


const updateRecentlyPlayed = (track) => {
  let recent = JSON.parse(sessionStorage.getItem("recentlyPlayed")) || [];

  recent = recent.filter((item) => item.id !== track.id);

  recent.unshift(track);

  if (recent.length > 10) {
    recent = recent.slice(0, 10);
  }

  sessionStorage.setItem("recentlyPlayed", JSON.stringify(recent));
};

const App = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [favorite, setFavorite] = useState([]);


  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch("/data.json");
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };
  
    fetchTracks();
  }, []);

  return (
    <main className="bg-dark vh-100">
      <Container fluid>
        <Row className="h-100">
          <Col md={7} lg={6} className="p-0">
            <Sidebar setCurrentTrack={setCurrentTrack} tracks={tracks} favorite={favorite} updateRecentlyPlayed={updateRecentlyPlayed}/>
          </Col>

          <Col md={5} lg={6} className="p-0">
            <Player  currentTrack={currentTrack} setFavorite={setFavorite} />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default App;
