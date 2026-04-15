import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-black/70 backdrop-blur text-white">
      <h1 className="text-xl font-bold tracking-wide">Civic Portal</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-orange-400">Home</Link>
        <Link to="/citizen" className="hover:text-orange-400">Citizen</Link>
        <Link to="/officer" className="hover:text-orange-400">Officer</Link>
      </div>
    </nav>
  );
}
