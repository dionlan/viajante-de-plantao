// app/profile/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  CreditCard,
  Plane,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  TrendingUp,
  Calendar,
  DollarSign,
  UserCheck,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";

// Tipos para os dados do usuário e programas de milhas
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  totalTransactions: number;
  rating: number;
  verified: boolean;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  program: "latam" | "gol" | "azul";
  totalMiles: number;
  lastUpdate: string;
  connected: boolean;
  credentials?: {
    username: string;
    password: string;
  };
  transactions: MileTransaction[];
}

interface MileTransaction {
  id: string;
  date: string;
  description: string;
  miles: number;
  type: "earned" | "redeemed" | "transfer";
  partner?: string;
  buyer?: string;
}

// Mock data
const mockUser: UserProfile = {
  id: "1",
  name: "Ana Silva",
  email: "ana.silva@email.com",
  phone: "+55 (11) 99999-9999",
  memberSince: "2022-01-15",
  totalTransactions: 47,
  rating: 4.9,
  verified: true,
};

const mockLoyaltyPrograms: LoyaltyProgram[] = [
  {
    id: "1",
    name: "LATAM Pass",
    program: "latam",
    totalMiles: 0,
    lastUpdate: "",
    connected: false,
    transactions: [],
  },
  {
    id: "2",
    name: "Smiles",
    program: "gol",
    totalMiles: 0,
    lastUpdate: "",
    connected: false,
    transactions: [],
  },
  {
    id: "3",
    name: "TudoAzul",
    program: "azul",
    totalMiles: 0,
    lastUpdate: "",
    connected: false,
    transactions: [],
  },
];

export default function ProfilePage() {
  const [user] = useState<UserProfile>(mockUser);
  const [programs, setPrograms] =
    useState<LoyaltyProgram[]>(mockLoyaltyPrograms);
  const [syncingProgram, setSyncingProgram] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [credentials, setCredentials] = useState<{
    [key: string]: { username: string; password: string };
  }>({});
  const [syncStatus, setSyncStatus] = useState<{
    programId: string | null;
    message: string;
    type: "info" | "success" | "error";
  }>({
    programId: null,
    message: "",
    type: "info",
  });

  const togglePasswordVisibility = (programId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [programId]: !prev[programId],
    }));
  };

  const handleCredentialChange = (
    programId: string,
    field: string,
    value: string
  ) => {
    setCredentials((prev) => ({
      ...prev,
      [programId]: {
        ...prev[programId],
        [field]: value,
      },
    }));
  };

  const showStatusMessage = (
    programId: string,
    message: string,
    type: "info" | "success" | "error" = "info"
  ) => {
    setSyncStatus({ programId, message, type });
    setTimeout(() => {
      setSyncStatus((prev) =>
        prev.programId === programId
          ? { programId: null, message: "", type: "info" }
          : prev
      );
    }, 5000);
  };

  const syncProgram = async (programId: string) => {
    const program = programs.find((p) => p.id === programId);
    if (!program) return;

    setSyncingProgram(programId);
    showStatusMessage(programId, "Iniciando sincronização...", "info");

    try {
      if (programId === "1") {
        // LATAM - Usar API Python
        const programCreds = credentials[programId];

        if (!programCreds?.username || !programCreds?.password) {
          showStatusMessage(
            programId,
            "Credenciais não encontradas. Por favor, reconecte o programa.",
            "error"
          );
          setSyncingProgram(null);
          return;
        }

        showStatusMessage(programId, "Conectando com LATAM Pass...", "info");

        const response = await fetch("/api/latam/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: programCreds.username,
            password: programCreds.password,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setPrograms((prev) =>
            prev.map((program) => {
              if (program.id === programId) {
                return {
                  ...program,
                  totalMiles: result.miles,
                  lastUpdate: new Date().toISOString(),
                  connected: true,
                };
              }
              return program;
            })
          );

          showStatusMessage(
            programId,
            `✅ ${result.message} | ${result.miles.toLocaleString(
              "pt-BR"
            )} milhas`,
            "success"
          );
        } else {
          showStatusMessage(programId, `❌ ${result.message}`, "error");
        }
      } else {
        // Outros programas - Mock
        showStatusMessage(programId, "Sincronizando com o programa...", "info");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const newMiles = program.totalMiles + Math.floor(Math.random() * 1000);
        setPrograms((prev) =>
          prev.map((program) => {
            if (program.id === programId) {
              return {
                ...program,
                totalMiles: newMiles,
                lastUpdate: new Date().toISOString(),
              };
            }
            return program;
          })
        );

        showStatusMessage(
          programId,
          `✅ Sincronização concluída! ${newMiles.toLocaleString(
            "pt-BR"
          )} milhas`,
          "success"
        );
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      showStatusMessage(
        programId,
        "❌ Erro ao sincronizar. Tente novamente.",
        "error"
      );
    } finally {
      setSyncingProgram(null);
    }
  };

  const connectProgram = async (programId: string) => {
    const programCreds = credentials[programId];
    if (!programCreds?.username || !programCreds?.password) {
      showStatusMessage(
        programId,
        "Por favor, preencha usuário e senha",
        "error"
      );
      return;
    }

    setSyncingProgram(programId);
    showStatusMessage(programId, "Conectando com o programa...", "info");

    try {
      if (programId === "1") {
        // LATAM - Usar API Python
        showStatusMessage(programId, "Autenticando com LATAM Pass...", "info");

        const response = await fetch("/api/latam/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: programCreds.username,
            password: programCreds.password,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setPrograms((prev) =>
            prev.map((program) => {
              if (program.id === programId) {
                return {
                  ...program,
                  connected: true,
                  totalMiles: result.miles,
                  lastUpdate: new Date().toISOString(),
                };
              }
              return program;
            })
          );

          showStatusMessage(
            programId,
            `✅ ${result.message} | ${result.miles.toLocaleString(
              "pt-BR"
            )} milhas`,
            "success"
          );
        } else {
          showStatusMessage(programId, `❌ ${result.message}`, "error");
        }
      } else {
        // Outros programas - Mock
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockMiles = 1000 + Math.floor(Math.random() * 5000);
        setPrograms((prev) =>
          prev.map((program) => {
            if (program.id === programId) {
              return {
                ...program,
                connected: true,
                totalMiles: mockMiles,
                lastUpdate: new Date().toISOString(),
              };
            }
            return program;
          })
        );

        showStatusMessage(
          programId,
          `✅ Conectado com sucesso! ${mockMiles.toLocaleString(
            "pt-BR"
          )} milhas`,
          "success"
        );
      }
    } catch (error) {
      console.error("Erro ao conectar programa:", error);
      showStatusMessage(
        programId,
        "❌ Erro ao conectar. Tente novamente.",
        "error"
      );
    } finally {
      setSyncingProgram(null);
    }
  };

  const getProgramConfig = (program: string) => {
    const configs = {
      latam: {
        color: "bg-red-50 text-red-700 border-red-200",
        gradient: "from-red-500 to-red-600",
        icon: "🔴",
        name: "LATAM Pass",
      },
      gol: {
        color: "bg-orange-50 text-orange-700 border-orange-200",
        gradient: "from-orange-500 to-orange-600",
        icon: "🟠",
        name: "Smiles",
      },
      azul: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        gradient: "from-blue-500 to-blue-600",
        icon: "🔵",
        name: "TudoAzul",
      },
    };
    return (
      configs[program as keyof typeof configs] || {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        gradient: "from-gray-500 to-gray-600",
        icon: "✈️",
        name: "Programa",
      }
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMiles = (miles: number) => {
    return miles.toLocaleString("pt-BR");
  };

  const getStatusColor = (type: "info" | "success" | "error") => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-poppins">
            Meu Perfil
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie suas informações pessoais e programas de milhas
          </p>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {syncStatus.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "mb-6 p-4 rounded-2xl border backdrop-blur-sm",
                getStatusColor(syncStatus.type)
              )}
            >
              <div className="flex items-center gap-3">
                {syncStatus.type === "success" && (
                  <CheckCircle className="w-5 h-5" />
                )}
                {syncStatus.type === "error" && (
                  <AlertCircle className="w-5 h-5" />
                )}
                {syncStatus.type === "info" && (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                )}
                <span className="font-medium">{syncStatus.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Coluna da Esquerda - Informações Pessoais */}
          <div className="xl:col-span-1 space-y-6">
            {/* Card de Perfil */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#317873] to-[#a0d6b4] rounded-3xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
                  {user.name}
                </h2>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <StarRating rating={user.rating} size="sm" />
                  <span className="text-sm text-gray-600">
                    {user.rating.toFixed(1)}
                  </span>
                </div>

                {user.verified && (
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <UserCheck className="w-4 h-4" />
                    Perfil Verificado
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl">
                  <Mail className="w-5 h-5 text-[#317873]" />
                  <div>
                    <div className="text-sm text-gray-600">E-mail</div>
                    <div className="font-medium text-gray-900">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl">
                  <CreditCard className="w-5 h-5 text-[#317873]" />
                  <div>
                    <div className="text-sm text-gray-600">Telefone</div>
                    <div className="font-medium text-gray-900">
                      {user.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl">
                  <Calendar className="w-5 h-5 text-[#317873]" />
                  <div>
                    <div className="text-sm text-gray-600">Membro desde</div>
                    <div className="font-medium text-gray-900">
                      {new Date(user.memberSince).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl">
                  <Plane className="w-5 h-5 text-[#317873]" />
                  <div>
                    <div className="text-sm text-gray-600">Transações</div>
                    <div className="font-medium text-gray-900">
                      {user.totalTransactions} realizadas
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card de Segurança */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold text-gray-900">Segurança</h3>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Suas credenciais de programas de milhas são armazenadas com
                criptografia de ponta a ponta.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Criptografia AES-256</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Autenticação segura</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Dados protegidos</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Coluna da Direita - Programas de Milhas */}
          <div className="xl:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-[#317873]" />
                Meus Programas de Milhas
              </h2>

              <div className="space-y-6">
                {programs.map((program, index) => {
                  const config = getProgramConfig(program.program);
                  const programCreds = credentials[program.id] || {
                    username: "",
                    password: "",
                  };
                  const isSyncing = syncingProgram === program.id;

                  return (
                    <motion.div
                      key={program.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                    >
                      {/* Header do Programa */}
                      <div className="p-6 border-b border-gray-100/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${config.color} text-lg`}
                            >
                              {config.icon}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg font-poppins">
                                {program.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                {program.connected ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-green-600">
                                      Conectado
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      • Atualizado{" "}
                                      {formatDate(program.lastUpdate)}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm text-amber-600">
                                      Não conectado
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {program.connected && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#317873] font-poppins">
                                {formatMiles(program.totalMiles)}
                              </div>
                              <div className="text-sm text-gray-600">
                                milhas disponíveis
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Conteúdo do Programa */}
                      <div className="p-6">
                        {!program.connected ? (
                          // Formulário de Conexão
                          <div className="space-y-4">
                            <p className="text-gray-600">
                              Conecte sua conta {program.name} para acompanhar
                              suas milhas automaticamente.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Usuário
                                </label>
                                <input
                                  type="text"
                                  value={programCreds.username}
                                  onChange={(e) =>
                                    handleCredentialChange(
                                      program.id,
                                      "username",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#317873] focus:border-transparent transition-all duration-200"
                                  placeholder="Seu usuário"
                                  disabled={isSyncing}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Senha
                                </label>
                                <div className="relative">
                                  <input
                                    type={
                                      showPassword[program.id]
                                        ? "text"
                                        : "password"
                                    }
                                    value={programCreds.password}
                                    onChange={(e) =>
                                      handleCredentialChange(
                                        program.id,
                                        "password",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#317873] focus:border-transparent transition-all duration-200 pr-12"
                                    placeholder="Sua senha"
                                    disabled={isSyncing}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      togglePasswordVisibility(program.id)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                    disabled={isSyncing}
                                  >
                                    {showPassword[program.id] ? (
                                      <EyeOff className="w-5 h-5" />
                                    ) : (
                                      <Eye className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <Button
                              onClick={() => connectProgram(program.id)}
                              loading={isSyncing}
                              variant="primary"
                              icon={<UserCheck className="w-5 h-5" />}
                              className="w-full"
                              disabled={isSyncing}
                            >
                              {isSyncing ? "Conectando..." : "Conectar Conta"}
                            </Button>
                          </div>
                        ) : (
                          // Programa Conectado
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm text-gray-600">
                                  Saldo atual
                                </div>
                                <div className="text-3xl font-bold text-[#317873] font-poppins">
                                  {formatMiles(program.totalMiles)} milhas
                                </div>
                              </div>

                              <Button
                                onClick={() => syncProgram(program.id)}
                                loading={isSyncing}
                                variant="outline"
                                icon={<RefreshCw className="w-5 h-5" />}
                                disabled={isSyncing}
                              >
                                {isSyncing ? "Sincronizando..." : "Atualizar"}
                              </Button>
                            </div>

                            {/* Status de Sincronização */}
                            {isSyncing && (
                              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                                <div className="text-sm text-blue-700">
                                  {program.id === "1"
                                    ? "Conectando com LATAM Pass... Isso pode levar alguns minutos."
                                    : "Sincronizando com o programa..."}
                                </div>
                              </div>
                            )}

                            {/* Histórico de Transações (apenas para programas com dados) */}
                            {program.transactions.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <DollarSign className="w-5 h-5 text-[#317873]" />
                                  Histórico Recente
                                </h4>

                                <div className="space-y-3">
                                  {program.transactions.map((transaction) => (
                                    <div
                                      key={transaction.id}
                                      className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/80"
                                    >
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                          {transaction.description}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                          {transaction.partner &&
                                            `${transaction.partner} • `}
                                          {transaction.buyer &&
                                            `Comprador: ${transaction.buyer} • `}
                                          {new Date(
                                            transaction.date
                                          ).toLocaleDateString("pt-BR")}
                                        </div>
                                      </div>

                                      <div
                                        className={cn(
                                          "text-lg font-semibold",
                                          transaction.miles > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                        )}
                                      >
                                        {transaction.miles > 0 ? "+" : ""}
                                        {formatMiles(transaction.miles)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
