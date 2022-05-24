import React from "react";
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container>
    <Navbar.Brand href="#home">NFT 명함 만들기</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
      <Nav.Link href="#">오픈씨 컬렉션 주소</Nav.Link>
      <Nav.Link href="#">컨트랙트 조회</Nav.Link>
      </Nav>
    </Navbar.Collapse>
    </Container>
    </Navbar>
  );
};

export default NavBar;