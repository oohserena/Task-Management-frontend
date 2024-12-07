"use client";

import TaskInputArea from "@/components/TaskInputArea";
import TeamMemberArea from "@/components/TeamMemberArea";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io"// for redirect after logout

export default function Home() {
  const { user, error, isLoading, logout } = useUser();
  const [showLogout, setShowLogout] = useState(false); // State to toggle logout visibility
  const router = useRouter(); // For redirecting after logout

  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleProfileClick = () => {
    setShowLogout(!showLogout); // Toggle logout visibility when profile image is clicked
  };

  return (
    <div>
      <div className="flex items-center justify-between px-4">

        <div className="mt-6 ml-14">
          <h1 className="font-bold font-sans text-xl md:text-3xl">
            Project Name
          </h1>
        </div>


        <div>
          {user ? (
            <div className="mt-6 mr-12 flex gap-4 items-center">
              <Image
                src={user.picture}
                alt="User Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                width={40} 
                height={40} 
                onClick={handleProfileClick} 
              />

              <Link href="/api/auth/logout" className="text-2xl mt-2 hover:text-red-700">
                <IoIosLogOut />
              </Link>
            </div>

          ) : (
            <Link href="/api/auth/login" className="mt-6 mr-12 flex gap-4 items-center">
              <button className="bg-red-500 text-white px-4 py-2 rounded">
                Login
              </button>
            </Link>

          )}

        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 px-4 md:px-12">
        <TaskInputArea title="To Do" color="#E84D31" />
        <TaskInputArea title="In Progress" color="#E8D43B" />
        <TaskInputArea title="Done" color="#7ECA62" />
        <TaskInputArea title="Backlog" color="#339CD8" />
        <TeamMemberArea />
      </div>

    </div>
  );
}
