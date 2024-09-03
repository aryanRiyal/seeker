import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../../main';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const { isAuthorized } = useContext(Context);
    const navigateTo = useNavigate();

    useEffect(function () {
        try {
            axios
                .get('http://localhost:4000/api/v1/job/getAll', { withCredentials: true })
                .then((res) => setJobs(res.data));
        } catch (error) {
            console.error(error);
        }
    }, []);

    if (!isAuthorized) {
        navigateTo('/login');
    }

    return (
        <>
            <section className='jobs page'>
                <div className='container'>
                    <h1>ALL AVAILABLE JOBS</h1>
                    <div className='banner'>
                        {jobs.jobs &&
                            jobs.jobs.map((element) => {
                                return (
                                    <div className='card' key={element.id}>
                                        <p>{element.title}</p>
                                        <p>{element.category}</p>
                                        <p>{element.company}</p>
                                        <p>{element.country}</p>
                                        <Link to={`/job/${element._id}`}>Job Details</Link>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Jobs;
