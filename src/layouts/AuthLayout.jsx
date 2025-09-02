import React from 'react';
import { Link, Outlet } from 'react-router';
import useAuth from '../hooks/useAuth';

const AuthLayout = () => {
    const {user} = useAuth();
    return (
        <div>
            {
                !user && (
                    <Outlet></Outlet>
                )
            }
        </div>
    );
};

export default AuthLayout;