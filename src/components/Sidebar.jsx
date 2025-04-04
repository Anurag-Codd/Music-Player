import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { PiMusicNoteFill } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { HiSwatch } from "react-icons/hi2";

const Sidebar = ({ setCurrentTrack, tracks, updateRecentlyPlayed }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("For You");
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [filteredTracks, setFilteredTracks] = useState(tracks);

  const categories = ["For You", "Top Tracks", "Favorite", "Recently Played"];

  useEffect(() => {
    if (selectedCategory === "Recently Played") {
      const recent = JSON.parse(sessionStorage.getItem("recentlyPlayed")) || [];
      setFilteredTracks(recent);
    } else {
      setFilteredTracks(tracks);
    }
  }, [selectedCategory, tracks]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = tracks.filter((track) =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTracks(filtered);
    }, 300); // 300ms debounce
  
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, tracks]);

  return (
    <Container fluid>
      <Row>
        <Col
          md={4}
          lg={5}
          className="text-white vh-100 d-none d-md-flex flex-column p-2"
        >
          <Navbar.Brand className="fw-bold fs-5 mb-3 d-flex align-items-center">
            <PiMusicNoteFill className="me-2" />
            <span>Beat</span>
          </Navbar.Brand>

          <Nav className="flex-column">
            {categories.map((cat) => (
              <Nav.Link
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`hover-bg fw-semibold ${
                  selectedCategory === cat ? "text-white" : "text-secondary"
                }`}
              >
                {cat}
              </Nav.Link>
            ))}
          </Nav>
        </Col>

        <Col md={8} lg={7} className="text-white vh-100 p-3">
          <div className="d-flex align-items-center mb-3">
            <Button
              variant="light"
              onClick={() => setShowSidebar(true)}
              className="d-md-none bg-transparent border-0 text-white"
            >
              <HiSwatch size={20} />
            </Button>
            <h4 className="fs-4 mb-0 ms-2">{selectedCategory}</h4>
          </div>

          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search Song"
              style={{ boxShadow: "none", outline: "none" }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroup.Text>
              <IoSearch />
            </InputGroup.Text>
          </InputGroup>

          <div
            className="d-flex flex-column gap-2 overflow-auto"
            style={{ maxHeight: "calc(100vh - 120px)", paddingBottom: "1rem" }}
          >
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                className={activeTrackId === track.id ? "active-bg" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setActiveTrackId(track.id);
                  setCurrentTrack(track);
                  updateRecentlyPlayed(track);
                }}
              >
                <Card className="d-flex flex-row align-items-center p-2 border-0 bg-transparent">
                  <Card.Img
                    src={track.thumbnail}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body className="ms-3 p-0">
                    <Card.Title className="fs-6 m-0 text-white">
                      {track.title}
                    </Card.Title>
                    <Card.Text className="fs-6 text-secondary">
                      {track.artistName}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="border-0 bg-transparent fs-6 text-white">
                    {track.duration}
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className="bg-dark text-white"
        responsive="md"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Categories</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {categories.map((cat) => (
              <Nav.Link
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowSidebar(false);
                }}
                className={`hover-bg fw-semibold ${
                  selectedCategory === cat ? "text-white" : "text-secondary"
                }`}
              >
                {cat}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default Sidebar;
