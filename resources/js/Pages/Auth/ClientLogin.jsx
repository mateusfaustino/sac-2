import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function ClientLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        cnpj: '',
        password: '',
        remember: false,
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
        
        post(route('client.login'), {
            data: {
                ...data,
                cnpj: cleanCnpj
            },
            onFinish: () => reset('password'),
        });
    };

    // Auto-focus on CNPJ field
    useEffect(() => {
        const cnpjField = document.getElementById('cnpj');
        if (cnpjField) {
            cnpjField.focus();
        }
    }, []);

    return (
        <GuestLayout>
            <Head title="Login do Cliente" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="cnpj" value="CNPJ" />

                    <TextInput
                        id="cnpj"
                        name="cnpj"
                        value={data.cnpj}
                        className="mt-1 block w-full"
                        autoComplete="off"
                        isFocused={true}
                        onChange={handleCnpjChange}
                        maxLength="18"
                        placeholder="00.000.000/0000-00"
                    />

                    <InputError message={errors.cnpj} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Senha" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Lembrar-me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Esqueceu sua senha?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Entrar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}