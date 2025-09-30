import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        cnpj: '',
        company_name: '',
    });

    // Format CNPJ as user types
    const formatCnpj = (value) => {
        const digits = value.replace(/\D/g, '').substring(0, 14);
        let formatted = digits;
        
        if (digits.length > 2) {
            formatted = digits.substring(0, 2) + '.' + digits.substring(2);
        }
        if (digits.length > 5) {
            formatted = formatted.substring(0, 6) + '.' + digits.substring(5);
        }
        if (digits.length > 8) {
            formatted = formatted.substring(0, 10) + '/' + digits.substring(8);
        }
        if (digits.length > 12) {
            formatted = formatted.substring(0, 15) + '-' + digits.substring(12);
        }
        
        return formatted;
    };

    const handleCnpjChange = (e) => {
        const formatted = formatCnpj(e.target.value);
        setData('cnpj', formatted);
    };

    const submit = (e) => {
        e.preventDefault();

        // Remove formatting for submission
        const cleanCnpj = data.cnpj.replace(/\D/g, '');
        
        post(route('register'), {
            data: {
                ...data,
                cnpj: cleanCnpj
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrar" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Nome" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="cnpj" value="CNPJ" />

                    <TextInput
                        id="cnpj"
                        name="cnpj"
                        value={data.cnpj}
                        className="mt-1 block w-full"
                        autoComplete="off"
                        onChange={handleCnpjChange}
                        maxLength="18"
                        placeholder="00.000.000/0000-00"
                        required
                    />

                    <InputError message={errors.cnpj} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="company_name" value="Razão Social" />

                    <TextInput
                        id="company_name"
                        name="company_name"
                        value={data.company_name}
                        className="mt-1 block w-full"
                        autoComplete="organization"
                        onChange={(e) => setData('company_name', e.target.value)}
                        required
                    />

                    <InputError message={errors.company_name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Senha" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Senha"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Já registrado?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Registrar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}