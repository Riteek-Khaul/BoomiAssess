import React, { useState,useEffect,useMemo } from 'react';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../AuthModal';
import Loader from '../Loader';
import axios from 'axios';
import '../styling/extract.css'

const Extract = () => {

    const [boomiaccountId, setBoomiAccountId] = useState('');
    const [boomiUsername, setBoomiUsername] = useState('');
    const [processes, setProcesses] = useState({ type: 'QueryResult', numberOfResults: 0, result: [] });
    const [selectedProcesses, setSelectedProcesses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showExtractModal, setShowExtractModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [Auth, setAuth] = useState(() => {
        // Initialize Auth state from local storage if available
        const savedAuth = localStorage.getItem('Auth');
        return savedAuth ? JSON.parse(savedAuth) : true;
      });

    const navigate = useNavigate();

    const handleAccountIdChange = (event) => {
        setBoomiAccountId(event.target.value);
    };

    const handleBoomiUsernameChange = (event) => {
        setBoomiUsername(event.target.value);
    };

    const downloadCSV = (filename, csvData) => {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    useEffect(() => {
        if (processes.result && processes.result.length > 0) {
            setShowExtractModal(true);
        } else {
            setShowExtractModal(false);
        }
    }, [processes]);

    const filteredProcesses = useMemo(() => {
        if (!searchTerm) return processes.result || [];
        return (processes.result || []).filter(proc =>
            proc.name && proc.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [processes, searchTerm]);

    const handleProcessCheckbox = (id) => {
        setSelectedProcesses(prev =>
            prev.includes(id)
                ? prev.filter(pid => pid !== id)
                : [...prev, id]
        );
    };

    const handleModalCancel = () => {
        setSelectedProcesses([]);
        setSearchTerm('');
        setShowExtractModal(false);
        setProcesses({ ...processes, result: [] }); // Optionally clear processes to hide modal
    };

    const handleExtract = async() => {
        console.log(selectedProcesses);
          if (boomiaccountId && boomiUsername) {
            alert(`Extracting data for Account ID: ${boomiaccountId}`);
            try {
                setIsLoading(true)
                const url = 'https://aincfapim.test.apimanagement.eu10.hana.ondemand.com:443/boomiassess/selective_extractprocessmetadata';
                const response = await axios.post(url, {
                    params: {
                        boomiaccountId: boomiaccountId,
                        boomiUsername: boomiUsername
                    },
                    headers: {
                        'Accept': 'text/plain',
                        'Content-Type': 'text/plain',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    responseType: 'text',
                    data: {
                        selectedProcesses: selectedProcesses
                    },
                });
                downloadCSV('response_data.csv', response.data);
                navigate('/success', { state: { message: 'Data extracted successfully!' } });
            } catch (error) {
                console.error('Error making authenticated request:', error);
                alert("Something Went wrong!...Please check the Account ID or Associated Credentials!")
            }
            setIsLoading(false);
        } else {
            alert('Please enter Boomi Account ID.');
        }
        setShowExtractModal(false);
    };

    return (
        <div className='App'>
            <Navbar />

            <div id="heading" className="heading">
                <h1>BoomiAsses by <img src="logo.png" alt="Company Logo" className="logo" /></h1>
            </div>

            <div id="extractPage" className="page">
                <h2>Extract Processes Metadata</h2>
                <label for="boomiAccountId">Boomi Account ID:</label>
                <input
                    type="text"
                    id="boomiAccountId"
                    placeholder="Enter Boomi Account ID"
                    value={boomiaccountId}
                    onChange={handleAccountIdChange} />
                <label htmlFor="boomiUsername">Username</label>
                <input
                    type="text"
                    id="boomiUsername"
                    placeholder="Enter Boomi Username"
                    value={boomiUsername}
                    onChange={handleBoomiUsernameChange}
                />
                <button onClick={getProcesses}>Fetch All Processes</button>
            </div>

            {/* Modal for displaying fetched processes with selection, search, and actions */}
            {processes.result && processes.result.length > 0 && (
                <div className="extract-modal-overlay">
                    <div className="extract-modal">
                        <div className="extract-modal-header">
                            <span className="extract-modal-count">
                                Selected: {selectedProcesses ? selectedProcesses.length : 0} / {processes.result.length}
                            </span>
                            <input
                                type="text"
                                className="extract-modal-search"
                                placeholder="Search processes..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="extract-modal-body">
                            <div className="extract-modal-process-list">
                                {filteredProcesses.length > 0 ? (
                                    filteredProcesses.map((process, idx) => (
                                        <label key={process.id || idx} className="extract-modal-process-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedProcesses.includes(process.id)}
                                                onChange={() => handleProcessCheckbox(process.id)}
                                            />
                                            <span className="extract-modal-process-name">{process.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="extract-modal-no-results">No processes found.</div>
                                )}
                            </div>
                        </div>
                        <div className="extract-modal-footer">
                            <button className="extract-modal-btn extract-modal-btn-cancel" onClick={handleModalCancel}>
                                Cancel
                            </button>
                            <button
                                className="extract-modal-btn extract-modal-btn-extract"
                                onClick={handleExtract}
                                disabled={selectedProcesses.length === 0}
                            >
                                Extract
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

export default Extract