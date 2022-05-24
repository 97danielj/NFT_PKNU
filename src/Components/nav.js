import React from "react";
import { Nav, Navbar, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container>
    <Navbar.Brand >NFT 명함 만들기</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
      </Nav>
      <Nav>
        <Nav.Link href="https://testnets.opensea.io/collection/nft-pknu" target='_blank'>
          <img src="opensea.svg" width='30'></img>
        </Nav.Link>
        <Nav.Link href="https://baobab.klaytnfinder.io/account/0x666c529cf50fbd17dbc44ed8456b283b822cfe04" target='_blank'>
          <img src="klaytnfinder.png" width='30'></img>
        </Nav.Link>
        <Nav.Link href="https://github.com/ezardddd/NFT_PKNU" target='_blank'>
          <img src="github.png" width='30'></img>
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
    </Container>
    </Navbar>
  );
};

export default NavBar;