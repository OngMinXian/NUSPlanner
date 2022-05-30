import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <AiIcons.AiFillHome />,
  },

  {
    title: 'Today',
    path: '/',
    icon: <IoIcons.IoIosPaper />,
    // iconClosed: <RiIcons.RiArrowDownSFill />,
    // iconOpened: <RiIcons.RiArrowUpSFill />,

    // subNav: [
    //   {
    //     title: 'Calender',
    //     path: '/month-year',
    //     icon: <IoIcons.IoIosPaper />,
    //     cName: 'sub-nav'
    //   },
    // ]
  },
  {
    title: 'Calender',
    path: '/month-year',
    icon: <FaIcons.FaCartPlus />
  },
  {
    title: 'Progress Report',
    path: '/progress-report',
    icon: <FaIcons.FaCartPlus />
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: <IoIcons.IoMdPeople />
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <IoIcons.IoMdPeople />
  },
];