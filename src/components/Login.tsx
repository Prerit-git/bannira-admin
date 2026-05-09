"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setIsLoading(false);
      setError("Invalid credentials. Access Denied.");
    } else {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center overflow-hidden relative">
      {/* Background Subtle Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7B2D0A]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 blur-[120px] rounded-full" />

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            className="w-full max-w-md z-10"
          >
            <div className="text-center mb-12">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-16 h-16 bg-[#7B2D0A] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-[#7B2D0A]/40"
              >
                <Lock className="text-[#D4AF37]" size={28} />
              </motion.div>
              <div className="flex justify-center items-center flex-col">
              {/* <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Internal System</p> */}
              <Image src={"/bannira_web_logo.png"} height={50} width={200} alt="logo"/>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:bg-white/10 focus:border-[#D4AF37]/50 transition-all outline-none"
                      placeholder="admin@bannira.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:bg-white/10 focus:border-[#D4AF37]/50 transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-2xl text-[11px] font-bold uppercase border border-red-500/20"
                  >
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#D4AF37] text-[#7B2D0A] py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#D4AF37]/20 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Submit <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)]"
            >
              <ShieldCheck className="text-white" size={48} />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white text-3xl font-serif font-bold tracking-widest mb-2"
            >
              ACCESS GRANTED
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-green-500/80 text-[10px] font-black uppercase tracking-[0.5em]"
            >
              Redirecting to Secure Dashboard
            </motion.p>
            
            {/* Loading Bar Animation */}
            <div className="w-48 h-[2px] bg-white/10 mx-auto mt-10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                className="w-full h-full bg-green-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}