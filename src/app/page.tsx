'use client';


export default function Home() {

  const handleLogin = () => {
    window.location.href = '/api/auth';
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <button className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300" onClick={handleLogin}>
          Login with Google
        </button>
      </div>
    </>
  );
}
