import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
import AuthModal from '../AuthModal';
import Loader from '../Loader';

Chart.register(...registerables);

const Migrate = () => {

    const [boomiaccountId, setBoomiAccountId] = useState('');
    const [boomiUsername, setBoomiUsername] = useState('');
    const [processes, setProcesses] = useState({ type: 'QueryResult', numberOfResults: 0, result: [] });
    const [selectedProcess, setSelectedProcess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [SpecificProcess, setSpecificProcess] = useState();
    const [Auth, setAuth] = useState(() => {
        // Initialize Auth state from local storage if available
        const savedAuth = localStorage.getItem('Auth');
        return savedAuth ? JSON.parse(savedAuth) : true;
    });
    const [subprocessesdependencies, setSubprocessesdependencies] = useState([]);
    // Step for reusable resources
    const [reusableResources, setReusableResources] = useState([]);
    const [scriptsDetails, setScriptsDetails] = useState([]);
    const [xsltDetails, setXsltDetails] = useState([]);
    const [mapDetails, setMapDetails] = useState([]);

    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        setSpecificProcess(null); // Reset SpecificProcess state when closing modal
        setReusableResources([]);
        setSubprocessesdependencies([]);
        setScriptsDetails([]);
        setXsltDetails([]);
        setMapDetails([]);
    };


    const navigate = useNavigate();

    const handleAccountIdChange = (event) => {
        setBoomiAccountId(event.target.value);
    };

    const handleBoomiUsernameChange = (event) => {
        setBoomiUsername(event.target.value);
    };

    const getProcesses = async () => {
        if (boomiaccountId && boomiUsername) {
            alert(`Fetching processes for Account ID: ${boomiaccountId}`);
            try {
                setIsLoading(true);
                const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getallprocesses';
                const response = await axios.get(url, {
                    params: {
                        boomiaccountId: boomiaccountId,
                        boomiUsername: boomiUsername
                    },
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',

                    },
                });
                setProcesses(response.data);
            } catch (error) {
                console.error('Error fetching processes:', error);
                alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
            }
            setIsLoading(false);
        } else {
            alert('Please enter Boomi Account ID.');
        }
    };

    const Next = async () => {
        if (selectedProcess) {
            alert(`Fetching Metadata for Process ID: ${selectedProcess}`);
            try {
                setIsLoading(true);
                const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getspecificprocess';
                const response = await axios.get(url, {
                    params: {
                        boomiaccountId: boomiaccountId,
                        selectedProcess: selectedProcess
                    },
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                setSpecificProcess(response.data);
                openModal();
            } catch (error) {
                console.error('Error fetching processes:', error);
                alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
            }
            setIsLoading(false);
        } else {
            alert('Please enter Boomi Account ID.');
        }
        getScriptDetails();
        getXsltDetails();
        getMapDetails();
    };

    const getSubprocessesdependencies = async () => {
        if (boomiaccountId && boomiUsername) {
            try {
                setIsLoading(true);
                const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/fetchdependencies';
                const response = await axios.get(url, {
                    params: {
                        boomiUsername: boomiUsername,
                        boomiaccountId: boomiaccountId,
                        selectedProcess: selectedProcess
                    },
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',

                    },
                });
                setSubprocessesdependencies(response.data);
            } catch (error) {
                console.error('Error fetching dependencies:', error);
                alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
            }
            setIsLoading(false);
        } else {
            alert('Please enter Boomi Account ID.');
        }
    };

    const getReusableResources = async () => {
        if (boomiaccountId && boomiUsername) {
            try {
                setIsLoading(true);
                const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/fetchreusableresources';
                const response = await axios.get(url, {
                    params: {
                        boomiUsername: boomiUsername,
                        boomiaccountId: boomiaccountId,
                        selectedProcess: selectedProcess
                    },
                });
                setReusableResources(response.data);
            } catch (error) {
                console.error('Error fetching reusable resources:', error);
                alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
            }
            setIsLoading(false);
        } else {
            alert('Please enter Boomi Account ID.');
        }
    }

    const getScriptDetails = async () => {
        if (boomiaccountId && boomiUsername) {
            try {
                setIsLoading(true);
                const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getallscripts';
                const response = await axios.get(url, {
                    params: {
                        boomiuser: boomiUsername,
                        boomiaccountId: boomiaccountId,
                        selectedProcess: selectedProcess
                    },
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                setScriptsDetails(response.data);
            } catch (error) {
                console.error('Error fetching script details:', error);
                alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
            }
            setIsLoading(false);
        } else {
            alert('Please enter Boomi Account ID.');
        }
    }

    const getXsltDetails = async () => {
        if (boomiaccountId && boomiUsername) {
            try {
                setIsLoading(true);
                const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getallxslts';
                const response = await axios.get(url, {
                    params: {
                        boomiuser: boomiUsername,
                        boomiaccountId: boomiaccountId,
                        selectedProcess: selectedProcess
                    },
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                setXsltDetails(response.data);
            } catch (error) {
                console.error('Error fetching XSLT details:', error);
                alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
            }
            setIsLoading(false);
        } else {
            alert('Please enter Boomi Account ID.');
        }
    }

    const getMapDetails = async () => {
        if (boomiaccountId && boomiUsername) {
            try {
                setIsLoading(true);
                const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/getallmaps';
                const response = await axios.get(url, {
                    params: {
                        boomiuser: boomiUsername,
                        boomiaccountId: boomiaccountId,
                        selectedProcess: selectedProcess
                    },
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                    setMapDetails(response.data);
            } catch (error) {
                console.error('Error fetching map details:', error);
                alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
            }
            setIsLoading(false);
        } else {
            alert('Please enter Boomi Account ID.');
        }
    }

    const handleProcessChange = (event) => {
        setSelectedProcess(event.target.value);
    };

    return (
        <div className='App'>
            <Navbar />

            <div id="heading" className="heading">
                <h1>BoomiAsses by <img src="logo.png" alt="Company Logo" className="logo" /></h1>
            </div>

            <div id="migratePage" className="page">
                <h2>Migrate Processes</h2>
                {processes.result.length === 0 ? (
                    <>
                        <label htmlFor="boomiAccountId">Boomi Account ID:</label>
                        <input
                            type="text"
                            id="boomiAccountId"
                            placeholder="Enter Boomi Account ID"
                            value={boomiaccountId}
                            onChange={handleAccountIdChange}
                        />
                        <label htmlFor="boomiUsername">Username</label>
                        <input
                            type="text"
                            id="boomiUsername"
                            placeholder="Enter Boomi Username"
                            value={boomiUsername}
                            onChange={handleBoomiUsernameChange}
                        />
                        <button onClick={getProcesses}>Fetch All Processes</button>
                    </>
                ) : (
                    <div>
                        <label htmlFor="processSelect">Select Process: ( Total : {processes.numberOfResults} )</label>
                        <select
                            id="processSelect"
                            value={selectedProcess}
                            onChange={handleProcessChange}
                        >
                            <option value="">--Select a process--</option>
                            {processes.result.map((process, index) => (
                                <option key={index} value={process.id}>
                                    {process.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={Next}>Next</button>
                        {
                            SpecificProcess && (
                                <Modal
                                    showModal={showModal}
                                    handleClose={closeModal}
                                    SpecificProcess={SpecificProcess}
                                    boomiaccountId={boomiaccountId}
                                    selectedProcess={selectedProcess}
                                    boomiUsername={boomiUsername}
                                    setIsLoading={setIsLoading}
                                    getSubprocessesdependencies={getSubprocessesdependencies}
                                    subprocessesdependencies={subprocessesdependencies}
                                    getReusableResources={getReusableResources}
                                    reusableResources={reusableResources}
                                    scriptsDetails={scriptsDetails}
                                    xsltDetails={xsltDetails}
                                    mapDetails={mapDetails}
                                />
                            )
                        }
                    </div>
                )}
            </div>

            {isLoading && <Loader />}

            <div id="note" className="note">
                <p>
                    <strong>Note:</strong> Account user credentials need to be set up manually in CPI-Security material before running the tool for a specific account.
                </p>
            </div>
            {Auth && (<AuthModal setAuth={setAuth} />)}
            <footer>
                <p>
                    Developed and Maintained by Crave Infotech (for any support: riteek.khaul@craveinfotech.com)
                </p>
            </footer>


        </div>
    )
}

export default Migrate