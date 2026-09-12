import { useState } from "react";
import { Mail, Lock } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Inscription :", { email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F1115] px-4">
      <div className="w-full max-w-sm">

        <h1 className="text-2xl font-semibold text-[#E8E9EC] mb-1.5 tracking-tight">
          Inscription
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-[#B4B8C0] mb-1.5">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C616B]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@test.sn"
                required
                className="w-full bg-[#181B21] border border-[#2A2D34] rounded-lg py-2.5 pl-10 pr-3 text-sm text-[#E8E9EC] placeholder:text-[#5C616B] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]/50 focus:border-[#5B8DEF] transition-colors"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm text-[#B4B8C0]">
                Mot de passe
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C616B]" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#181B21] border border-[#2A2D34] rounded-lg py-2.5 pl-10 pr-10 text-sm text-[#E8E9EC] placeholder:text-[#5C616B] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]/50 focus:border-[#5B8DEF] transition-colors"
              />
            </div>
          </div>

          {/* Bouton de inscription */}
          <button
            type="submit"
            className="w-full bg-[#5B8DEF] hover:bg-[#7BA3F5] text-[#0F1115] font-medium text-sm rounded-lg py-2.5 transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#2A2D34] text-center">
          <p className="text-sm text-[#8A8F98] mb-3">Déja inscrit ?</p>
          <button
            type="button"
            onClick={() => window.location.href = "/login"}
            className="w-full border border-[#2A2D34] hover:border-[#3A3E47] hover:bg-[#181B21] text-[#E8E9EC] font-medium text-sm rounded-lg py-2.5 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register