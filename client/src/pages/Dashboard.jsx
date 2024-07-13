import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from './Profile';
import DashSidBar from './DashSidBar';
import DashPosts from './DashPosts';
import DashUsers from './DashUsers';
import Dashcomments from '../components/Dashcomments';
import DashComp from '../components/DashComp';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  
  return (
    <div className='flex'>
      {/* Sidebar */}
      <div className=''> {/* Set a fixed width for the sidebar */}
        <DashSidBar />
      </div>
      
      {/* Main Content */}
      <div className='flex-grow p-4'> {/* Allow the main content to take the remaining space */}
        {tab === 'profile' && <Profile />}
        {tab === 'post' && <DashPosts />}
        {tab === 'user' && <DashUsers/>}
        {tab === 'comments' && <Dashcomments/>}
        {tab === 'dash' && <DashComp/>}
      </div>
    </div>
  );
}

export default Dashboard;
