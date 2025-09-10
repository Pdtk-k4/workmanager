// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import authService from '../services/authService';
// import '../tailwind.css';

// const Register = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         if (password !== confirmPassword) {
//             setError('Mật khẩu không khớp');
//             return;
//         }
//         try {
//             const res = await authService.register({ name, email, password });
//             if (res?.id) {
//                 toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
//                 localStorage.removeItem('user'); // Xóa user để tránh lưu dữ liệu không cần thiết
//                 navigate('/login', { replace: true });
//             } else {
//                 setError('Không nhận được dữ liệu người dùng');
//             }
//         } catch (err) {
//             const message = err.response?.data?.message || err.message || 'Đăng ký thất bại';
//             setError(message);
//             toast.error(message);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
//             <div className="w-full max-w-md border border-gray-300 rounded-2xl py-7 px-6 sm:px-10 bg-white shadow-md">
//                 <h1 className="text-slate-900 text-center text-3xl font-semibold">Đăng ký</h1>

//                 {error && (
//                     <div className="text-red-600 text-sm mt-4 text-center">{error}</div>
//                 )}

//                 <form onSubmit={handleSubmit} className="mt-6 space-y-6">
//                     <div className="relative">
//                         <label className="text-slate-900 text-sm font-medium mb-2 block">Tên người dùng</label>
//                         <input
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             name="name"
//                             type="text"
//                             required
//                             className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 pr-10"
//                             placeholder="Nhập tên người dùng"
//                         />
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="#bbb"
//                             stroke="#bbb"
//                             className="w-5 h-5 absolute right-3 top-10"
//                             viewBox="0 0 24 24"
//                         >
//                             <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
//                             <path
//                                 d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
//                                 data-original="#000000"
//                             ></path>
//                         </svg>
//                     </div>

//                     <div className="relative">
//                         <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
//                         <input
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             name="email"
//                             type="email"
//                             required
//                             className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 pr-10"
//                             placeholder="Nhập email"
//                         />
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="#bbb"
//                             stroke="#bbb"
//                             className="w-5 h-5 absolute right-3 top-10"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7L12 13.4 4 8.7V6l8 4.7 8-4.7v2.7z"
//                                 data-original="#000000"
//                             ></path>
//                         </svg>
//                     </div>

//                     <div className="relative">
//                         <label className="text-slate-900 text-sm font-medium mb-2 block">Mật khẩu</label>
//                         <input
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             name="password"
//                             type={showPassword ? 'text' : "password"}
//                             required
//                             className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 pr-10"
//                             placeholder="Nhập mật khẩu"
//                         />
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="#bbb"
//                             stroke="#bbb"
//                             className="w-5 h-5 absolute right-3 top-10 cursor-pointer"
//                             viewBox="0 0 128 128"
//                             onClick={() => setShowPassword(!showPassword)}
//                         >
//                             <path
//                                 d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
//                                 data-original="#000000"
//                             ></path>
//                         </svg>
//                     </div>

//                     <div className="relative">
//                         <label className="text-slate-900 text-sm font-medium mb-2 block">Xác nhận mật khẩu</label>
//                         <input
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             name="confirmPassword"
//                             type={showConfirmPassword ? 'text' : "password"}
//                             required
//                             className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 pr-10"
//                             placeholder="Nhập lại mật khẩu"
//                         />
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="#bbb"
//                             stroke="#bbb"
//                             className="w-5 h-5 absolute right-3 top-10 cursor-pointer"
//                             viewBox="0 0 128 128"
//                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         >
//                             <path
//                                 d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
//                                 data-original="#000000"
//                             ></path>
//                         </svg>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
//                     >
//                         Đăng ký
//                     </button>

//                     <p className="text-center text-slate-900 text-sm">
//                         Đã có tài khoản?
//                         <a href="/login" className="text-blue-600 hover:underline font-semibold ml-1">Đăng nhập tại đây</a>
//                     </p>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Register;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import '../tailwind.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            toast.error('Mật khẩu không khớp');
            return;
        }
        // try {
        //     const res = await authService.register({ name, email, password });
        //     if (res?.id) {
        //         // Tự động đăng nhập sau khi đăng ký
        //         const loginRes = await authService.login({ name, password });
        //         if (loginRes?.id) {
        //             localStorage.setItem('user', JSON.stringify(loginRes));
        //             window.dispatchEvent(new Event('storage')); // Kích hoạt sự kiện storage
        //             toast.success('Đăng ký và đăng nhập thành công!');
        //             navigate('/dashboard', { replace: true });
        //         } else {
        //             setError('Không thể đăng nhập sau khi đăng ký');
        //             toast.error('Không thể đăng nhập sau khi đăng ký');
        //             navigate('/login', { replace: true });
        //         }
        //     } else {
        //         setError('Không nhận được dữ liệu người dùng');
        //         toast.error('Không nhận được dữ liệu người dùng');
        //     }
        // } catch (err) {
        //     const message = err.response?.data?.message || err.message || 'Đăng ký thất bại';
        //     setError(message);
        //     toast.error(message);
        // }
        try {
            const res = await authService.register({ name, email, password });
            if (res?.id) {
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                localStorage.removeItem('user'); // Xóa user để tránh lưu dữ liệu không cần thiết
                navigate('/login', { replace: true });
            } else {
                setError('Không nhận được dữ liệu người dùng');
            }
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Đăng ký thất bại';
            setError(message);
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md border border-gray-300 rounded-2xl py-7 px-6 sm:px-10 bg-white shadow-md">
                <h1 className="text-slate-900 text-center text-3xl font-semibold">Đăng ký</h1>

                {error && (
                    <div className="text-red-600 text-sm mt-4 text-center">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="relative">
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Tên người dùng</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            name="name"
                            type="text"
                            required
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 pr-10"
                            placeholder="Nhập tên người dùng"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#bbb"
                            stroke="#bbb"
                            className="w-5 h-5 absolute right-3 top-10"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                            <path
                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                data-original="#000000"
                            ></path>
                        </svg>
                    </div>

                    <div className="relative">
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            type="email"
                            required
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 pr-10"
                            placeholder="Nhập email"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#bbb"
                            stroke="#bbb"
                            className="w-5 h-5 absolute right-3 top-10"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7L12 13.4 4 8.7V6l8 4.7 8-4.7v2.7z"
                                data-original="#000000"
                            ></path>
                        </svg>
                    </div>

                    <div className="relative">
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Mật khẩu</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 pr-10"
                            placeholder="Nhập mật khẩu"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#bbb"
                            stroke="#bbb"
                            className="w-5 h-5 absolute right-3 top-10 cursor-pointer"
                            viewBox="0 0 128 128"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <path
                                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                                data-original="#000000"
                            ></path>
                        </svg>
                    </div>

                    <div className="relative">
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Xác nhận mật khẩu</label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 pr-10"
                            placeholder="Nhập lại mật khẩu"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#bbb"
                            stroke="#bbb"
                            className="w-5 h-5 absolute right-3 top-10 cursor-pointer"
                            viewBox="0 0 128 128"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <path
                                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                                data-original="#000000"
                            ></path>
                        </svg>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                    >
                        Đăng ký
                    </button>

                    <p className="text-center text-slate-900 text-sm">
                        Đã có tài khoản?
                        <a href="/login" className="text-blue-600 hover:underline font-semibold ml-1">Đăng nhập tại đây</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;