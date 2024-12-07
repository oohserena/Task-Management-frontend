"use client";

import React, { useState, useEffect } from 'react';
import { fetchTeamMembers } from '@/app/api/tasks/route';
import { useUser } from '@auth0/nextjs-auth0/client';

const TeamMemberArea = () => {
    const { user, error, isLoading } = useUser();
    const [team, setTeam] = useState([]);

    useEffect(() => {
        if (user) {
            const loadTeams = async () => {
                try {
                    const userTeam = await fetchTeamMembers(user.sub);
                    setTeam(userTeam)
                } catch (error) {
                    console.error("Error fetching team", error)
                }
            };
            loadTeams();
        }
    }, [user]);

    if (isLoading) return <div>Loading...</div>;  // Handle loading state if needed
    if (error) return <div>Error: {error.message}</div>;


    return (
        <div className="bg-[#E9E6DF] rounded-[10px] w-full h-[600px] sm:h-[580px] md:h-[700px] lg:h-[800px] overflow-y-auto relative">
            {/* Team Members Header */}
            <h2 className="ml-4 mt-6 font-bold text-lg">Team Members</h2>

            {/* Team Members List */}
            <div className="mt-4 ml-6 w-full">
                {team.map((member, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-[#948D77] rounded-full"></div>
                        <h2 className="ml-2 text-lg text-[#736F54] font-bold">{member}</h2>
                    </div>
                ))}
            </div>

            {/* +Item Button */}
            <div className="absolute bottom-4 ml-12 transform -translate-x-1/2">
                <button
                    className="bg-[#E9E6DF] text-[#948D77] font-bold rounded px-4 py-2"
                    onClick={() => setShowModal(true)}
                >
                    + Invite
                </button>
            </div>


        </div>
    );
};

export default TeamMemberArea;
