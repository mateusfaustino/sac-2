import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ProgressBar from '@/Components/ProgressBar';
import Breadcrumb from '@/Components/Breadcrumb';
import Tooltip from '@/Components/Tooltip';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AdminLayout({ header, children, breadcrumbs = [] }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    // Check if we're on mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSection = (sectionName) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const mainNavigation = [
        { 
            name: 'Painel', 
            href: route('admin.dashboard'), 
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            description: 'Visão geral do sistema'
        },
        { 
            name: 'Tickets', 
            href: route('admin.tickets.index'), 
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
            description: 'Gerenciar solicitações de clientes'
        },
        { 
            name: 'Clientes', 
            href: route('admin.clients.index'), 
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
            description: 'Gerenciar clientes cadastrados'
        },
        { 
            name: 'Produtos', 
            href: route('admin.products.index'), 
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            description: 'Gerenciar produtos do catálogo'
        },
    ];

    const adminNavigation = [
        { 
            name: 'Usuários Admin', 
            href: route('admin.admin-users.index'), 
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
            description: 'Gerenciar usuários administradores'
        },
    ];

    const userNavigation = [
        { name: 'Perfil', href: route('profile.edit') },
        { name: 'Sair', href: route('logout'), method: 'post' }
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            <ProgressBar />
            
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
            
            {/* Sidebar */}
            <div 
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 transition-all duration-300 transform shadow-xl ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
                aria-label="Barra lateral de navegação"
            >
                <div className="flex items-center justify-between h-16 px-4 bg-gray-900 border-b border-gray-700">
                    <div className="flex items-center">
                        <ApplicationLogo className="block h-8 w-auto fill-current text-white" />
                        <span className="ml-3 text-lg font-semibold text-white">Admin Portal</span>
                    </div>
                    <button
                        className="lg:hidden text-gray-400 hover:text-white focus:outline-none focus:text-white"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Fechar barra lateral"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* User Profile Section */}
                <div className="px-4 py-4 border-b border-gray-700 bg-gray-700">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-300 truncate">
                                {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    {/* Main Navigation Section */}
                    <div className="px-2">
                        <button
                            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:bg-gray-700 hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => toggleSection('main')}
                            aria-expanded={!collapsedSections['main']}
                            aria-controls="main-navigation"
                        >
                            <span>Navegação Principal</span>
                            <svg 
                                className={`h-4 w-4 transform transition-transform duration-200 ${collapsedSections['main'] ? '' : 'rotate-180'}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div 
                            id="main-navigation"
                            className={`mt-1 space-y-1 transition-all duration-300 ${collapsedSections['main'] ? 'hidden' : 'block'}`}
                        >
                            {mainNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        route().current(item.href.substring(item.href.lastIndexOf('/') + 1)) 
                                            ? 'bg-blue-600 text-white shadow-lg' 
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                    aria-current={route().current(item.href.substring(item.href.lastIndexOf('/') + 1)) ? 'page' : undefined}
                                >
                                    <Tooltip content={item.description} position="right">
                                        <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                    </Tooltip>
                                    <span className="truncate">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    {/* Admin Section */}
                    <div className="mt-6 px-2">
                        <button
                            className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:bg-gray-700 hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => toggleSection('admin')}
                            aria-expanded={!collapsedSections['admin']}
                            aria-controls="admin-navigation"
                        >
                            <span>Administração</span>
                            <svg 
                                className={`h-4 w-4 transform transition-transform duration-200 ${collapsedSections['admin'] ? '' : 'rotate-180'}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div 
                            id="admin-navigation"
                            className={`mt-1 space-y-1 transition-all duration-300 ${collapsedSections['admin'] ? 'hidden' : 'block'}`}
                        >
                            {adminNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        route().current(item.href.substring(item.href.lastIndexOf('/') + 1)) 
                                            ? 'bg-blue-600 text-white shadow-lg' 
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                    aria-current={route().current(item.href.substring(item.href.lastIndexOf('/') + 1)) ? 'page' : undefined}
                                >
                                    <Tooltip content={item.description} position="right">
                                        <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                    </Tooltip>
                                    <span className="truncate">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Mobile header */}
                <div className="flex items-center justify-between p-4 bg-white border-b lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                        aria-label="Abrir barra lateral"
                        aria-expanded={sidebarOpen}
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    
                    <div className="flex items-center">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-150"
                                        aria-label={`Menu do usuário ${user.name}`}
                                    >
                                        <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium mr-2">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="hidden sm:inline">{user.name}</span>
                                        <svg
                                            className="ml-2 -mr-0.5 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                {userNavigation.map((item) => (
                                    <Dropdown.Link
                                        key={item.name}
                                        href={item.href}
                                        method={item.method || 'get'}
                                        as={item.method === 'post' ? 'button' : 'a'}
                                    >
                                        {item.name}
                                    </Dropdown.Link>
                                ))}
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                {/* Desktop header */}
                <header className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b">
                    <div>
                        {header}
                    </div>
                    
                    <div className="flex items-center">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-150"
                                        aria-label={`Menu do usuário ${user.name}`}
                                    >
                                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-2">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="text-left hidden md:block">
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                                            </div>
                                        </div>
                                        <svg
                                            className="ml-2 -mr-0.5 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                {userNavigation.map((item) => (
                                    <Dropdown.Link
                                        key={item.name}
                                        href={item.href}
                                        method={item.method || 'get'}
                                        as={item.method === 'post' ? 'button' : 'a'}
                                    >
                                        {item.name}
                                    </Dropdown.Link>
                                ))}
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {/* Breadcrumbs */}
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <Breadcrumb breadcrumbs={breadcrumbs} />
                    </div>
                    
                    {children}
                </main>
            </div>
        </div>
    );
}