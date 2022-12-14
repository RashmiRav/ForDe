import React, { Component } from 'react';
import axios from 'axios';
import '../Components/editreport.css';
import { Link } from 'react-router-dom';
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { Button, Form, Row, Col, Dropdown } from 'react-bootstrap';



const initialstate = {
    _id: '',
    testId: '',
    chemistName: '',
    docName: '',
    date: '',
    testName: '',
    patientName: '',
    patientEmail: '',
    description: ''
}

export class EditLabReport extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = initialstate;
        this.state = {
            testId: '',
            chemistName: '',
            docName: '',
            date: '',
            testName: '',
            patientName: '',
            patientEmail: '',
            description: '',
            labreport: [],
            errors: {}
        }
    }

    componentDidMount() {
        console.log(this.props.match.params.id);
        axios.get(`/codebusters/api/labreport/get/${this.props.match.params.id}`)
            .then((response) => {

                console.log("Data", response.data);
                this.setState({ labreport: response.data, testId: response.data.testId })
                this.setState({ testId: response.data.labreport.testId })
                this.setState({ chemistName: response.data.labreport.chemistName })
                this.setState({ docName: response.data.labreport.docName })
                this.setState({ date: response.data.labreport.date })
                this.setState({ testName: response.data.labreport.testName })
                this.setState({ patientName: response.data.labreport.patientName })
                this.setState({ patientEmail: response.data.labreport.patientEmail })
                this.setState({ description: response.data.labreport.description })


            })
            .catch(function (error) {
                alert('error in get labreport to edit');
                console.log(error);
            })

    }


    handleSelect = (e) => {
        this.setState({ testName: e });
        console.log(e);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    formValidation = () => {
        const { docName, testName, patientName, patientEmail, description } = this.state;
        let isValid = true;
        const errors = {};

        if (!docName.trim()) {
            errors.docNameRequire = "Doctor name required";
            isValid = false;
        }
        
        if (!testName.trim()) {
            errors.testNameRequire = "Test name required";
            isValid = false;
        }
        if (!patientName.trim()) {
            errors.patientNameRequire = "Patient name required";
            isValid = false;
        }
        if (!patientEmail.trim()) {
            errors.patientEmailRequire = "Patient email required";
            isValid = false;
        }
        if (!patientEmail.includes("@")) {
            errors.patientEmailSign = "You have missed @ sign in email";
            isValid = false;
        }

        if (!description.trim()) {
            errors.descriptionRequire = "Description required";
            isValid = false;
        }

        this.setState({ errors });
        return isValid;

    }

    onSubmit(e) {
        e.preventDefault();
        const isValid = this.formValidation();
        const id = this.props.match.params.id;

        if (isValid) {
            let labreport = {
                testId: this.state.testId,
                chemistName: this.state.chemistName,
                docName: this.state.docName,
                date: this.state.date,
                testName: this.state.testName,
                patientName: this.state.patientName,
                patientEmail: this.state.patientEmail,
                description: this.state.description,

            }
            console.log('Data', labreport);

            axios.put(`/codebusters/api/labreport/edit/${id}`, labreport)
                .then(response => {
                    alert('Lab report updated Successfully')
                    window.location = `/labchemist/labreports`;
                })
                .catch(error => {
                    console.log(error.message);
                    alert(error.message)
                })

        }

    }

    render() {
        const { errors } = this.state;
        return (
            <div >
                <div style={{ paddingTop: "1vh" }}>
                    <div className="row row-cols-1 row-cols-md-3 g-4">

                        <div className="col">
                            <Link to="/labchemist/labreports">
                                <Button className="editRbtn" variant="secondary">Previous Lab Reports</Button>
                            </Link>
                        </div>
                        <Link to="/">
                            <div className="col">
                                <Button className="editRbtnr" variant="secondary">Report Requests</Button>
                            </div>
                        </Link>


                    </div>

                </div>
                <div className="editr">

                <div className="edittextTopic" style={{ paddingBottom: "1vh" }}>Edit Lab report</div>
                    <Form onSubmit={this.onSubmit} >

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridTestId">
                                <Form.Label>Test Id</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="0000"
                                    id="testId"
                                    name="testId"
                                    value={this.state.testId}
                                    onChange={this.onChange}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridChemist">
                                <Form.Label>Tested Lab Chemist Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Test Done Chemist"
                                    id="chemistName"
                                    name="chemistName"
                                    value={this.state.chemistName}
                                    onChange={this.onChange}
                                    
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridDate">
                                <Form.Label>Date</Form.Label>
                                <DateTimePickerComponent
                                    type="text"
                                    id="date"
                                    name="date"
                                    placeholder=""
                                    value={this.state.date}
                                    onChange={this.onChange}
                                    style={{ backgroundColor: "white", color: "black", padding: "6px", fontSize: "15px" }}
            
                                />
                                
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridTestname">
                                <Form.Label>Test Name</Form.Label>
                                <Dropdown as={Col} onSelect={this.handleSelect} >

                                    <Dropdown.Toggle id="dropdown-basic" style={{ width: "100%", height: "36px", color: "#000405 ", backgroundColor: "#B6C3C7 " }}>
                                        {this.state.testName}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu style={{ width: "100%" }}>
                                        <Dropdown.Item eventKey="Full Blood Count">Full Blood Count</Dropdown.Item>
                                        <Dropdown.Item eventKey="Blood Glucose">Blood Glucose</Dropdown.Item>
                                        <Dropdown.Item eventKey="Lipid Profile">Lipid Profile</Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                                {errors.testNameRequire && <p style={{ color: "#C92C2E", fontSize: "17px" }}>{errors.testNameRequire}</p>}
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="formGriddocname">
                            <Form.Label>Channeled Doctor</Form.Label>
                            <Form.Control
                                placeholder="Doctor Name"
                                id="docName"
                                name="docName"
                                value={this.state.docName}
                                onChange={this.onChange}
                            />
                            {errors.docNameRequire && <p style={{ color: "#C92C2E", fontSize: "17px" }}>{errors.docNameRequire}</p>}
                        </Form.Group>

                        <Row className="mb-3">


                            <Form.Group as={Col} controlId="formGridpName">
                                <Form.Label>Patient's Name</Form.Label>
                                <Form.Control
                                    placeholder="Patient's Name"
                                    id="patientName"
                                    name="patientName"
                                    value={this.state.patientName}
                                    onChange={this.onChange}
                                />
                                {errors.patientNameRequire && <p style={{ color: "#C92C2E", fontSize: "17px" }}>{errors.patientNameRequire}</p>}
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridpemail">
                                <Form.Label>Patient's Email</Form.Label>
                                <Form.Control
                                    placeholder="Patient's Emial"
                                    id="patientEmail"
                                    name="patientEmail"
                                    value={this.state.patientEmail}
                                    onChange={this.onChange} />
                                {errors.patientEmailRequire && <p style={{ color: "#C92C2E", fontSize: "17px" }}>{errors.patientEmailRequire}</p>}
                                {errors.patientEmailSign && <p style={{ color: "#C92C2E", fontSize: "17px" }}>{errors.patientEmailSign}</p>}
                            </Form.Group>
                        </Row>
                        <Form.Group as={Col} controlId="formGridTestId">
                            <Form.Label>Test Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Test Result"
                                id="description"
                                name="description"
                                rows="3"
                                value={this.state.description}
                                onChange={this.onChange}
                            />
                            {errors.descriptionRequire && <p style={{ color: "#C92C2E", fontSize: "17px" }}>{errors.descriptionRequire}</p>}
                        </Form.Group>

                        <div className="mb-3">
                            <button type="submit" className="editRepbtn">Edit Report Details</button>

                        </div>
                    </Form>
                    <br />

                </div>


            </div>
        )
    }
}

export default EditLabReport
